import { Router } from 'express';
require('dotenv').config();
import axios from 'axios';
const querystring = require('query-string');
import { AddTokensToDatabase } from '../database';
import { PollTokensFromDatabase } from '../database';
import { IntegrationTokens } from '../Types/types';
const jwt = require('jsonwebtoken');

const router = Router();
let hubspotID: string;

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;

let HUBSPOT_AUTH_URL: string;
if (HUBSPOT_CLIENT_ID && HUBSPOT_REDIRECT_URI) {
    HUBSPOT_AUTH_URL = `https://app.hubspot.com/oauth/authorize?client_id=${encodeURIComponent(
        HUBSPOT_CLIENT_ID,
    )}&redirect_uri=${encodeURIComponent(HUBSPOT_REDIRECT_URI)}&scope=contacts`;
} else {
    console.error(
        'HUBSPOT_CLIENT_ID:' +
            HUBSPOT_CLIENT_ID +
            ' or HUBSPOT_REDIRECT_URI:' +
            HUBSPOT_REDIRECT_URI +
            ' not defined in environment variables.',
    );
}

// Saasquatch
const SAASQUATCH_CLIENT_ID = process.env.SAASQUATCH_CLIENT_ID;
const SAASQUATCH_CLIENT_SECRET = process.env.SAASQUATCH_CLIENT_SECRET;

export const tokenStore: any = {};

// Generate Server Access Token for frontend requests
const generateAccessToken = (userID: string) => {
    return jwt.sign(
        {
            data: userID,
        },
        process.env.SERVER_TOKEN_SECRET,
        { expiresIn: '1h' },
    );
};

// Authenticate Server Access Token for frontend requests
export const authenticateToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.SERVER_TOKEN_SECRET);
        return decoded;
    } catch (err) {
        console.error(err.message);
    }
};

/**
 * Gets a new access token from Hubspot
 *
 * @param refreshToken Hubspot refresh token
 * @returns Hubspot access token object.
 */
export const getHubspotAccessToken = async (refreshToken: string | undefined): Promise<any> => {
    if (!refreshToken) {
        throw new Error(`Refresh token not provided to getHubspotAccessToken.`);
    } else if (!HUBSPOT_CLIENT_ID) {
        throw new Error(`No Hubspot Client ID.`);
    } else if (!HUBSPOT_CLIENT_SECRET) {
        throw new Error(`No Hubspot Client Secret.`);
    }
    try {
        const url = 'https://api.hubapi.com/oauth/v1/token';
        const refreshTokenProof = {
            grant_type: 'refresh_token',
            client_id: HUBSPOT_CLIENT_ID,
            client_secret: HUBSPOT_CLIENT_SECRET,
            refresh_token: refreshToken,
        };
        const resp = await axios.post(url, querystring.stringify(refreshTokenProof));
        return resp.data;
    } catch (e) {
        throw new Error(e);
    }
};

/**
 * Gets a new API JWT from Saasquatch
 *
 * @returns Saasquatch JWT object.
 */
export const getSaasquatchToken = async (): Promise<any> => {
    if (!SAASQUATCH_CLIENT_ID) {
        throw new Error(`No Saasquatch Client ID.`);
    } else if (!SAASQUATCH_CLIENT_SECRET) {
        throw new Error(`No Saasquatch Client Secret.`);
    }
    try {
        const url = 'https://squatch-dev.auth0.com/oauth/token';
        const tokenProof = {
            grant_type: 'client_credentials',
            client_id: SAASQUATCH_CLIENT_ID,
            client_secret: SAASQUATCH_CLIENT_SECRET,
            audience: 'https://staging.referralsaasquatch.com',
        };
        const resp = await axios.post(url, querystring.stringify(tokenProof));
        return resp.data;
    } catch (e) {
        throw new Error(e);
    }
};

// Start HubSpot OAuth flow
// 1. Check whether user has previously authenticated with Hubspot and received a token
router.get('/hubspot_authorization', async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (decoded != undefined) {
        try {
            res.json('Authorized');
            res.end();
        } catch (e) {
            console.error(e);
        }
    } else {
        if (HUBSPOT_AUTH_URL) {
            res.json('Unauthorized');
            res.end();
        } else {
            console.error('env AUTH_URL is undefined.');
        }
    }
});

// 2. Get Hubspot OAuth URL if the user has not authenticated
router.get('/hubspot_url', async (req, res) => {
    if (HUBSPOT_AUTH_URL) {
        res.json(HUBSPOT_AUTH_URL);
        res.end();
    } else {
        console.error('env AUTH_URL is undefined.');
    }
});

// 3. Get temporary authorization code from OAuth server
// 4. Combine temporary auth code with app credentials and send back to OAuth server
router.get('/oauth-callback', async (req, res) => {
    // If temp authorization code was received
    if (req.query.code) {
        const code: any = req.query.code;
        const authCodeProof = {
            grant_type: 'authorization_code',
            client_id: HUBSPOT_CLIENT_ID,
            client_secret: HUBSPOT_CLIENT_SECRET,
            redirect_uri: HUBSPOT_REDIRECT_URI,
            code: code,
        };
        try {
            // 4.Get access and refresh tokens
            const resp = await axios.post(
                'https://api.hubapi.com/oauth/v1/token',
                querystring.stringify(authCodeProof),
            );
            if (resp.status != 200) {
                throw Error('POST to get access and refresh tokens from HubSpot failed. Error:' + resp.data['error']);
            }

            // this api call is to retrieve the user id of the current user
            // the post api call above does not contain user_id
            const get_options = {
                headers: { accept: 'application/json' },
            };
            const get_user_id = await axios.get(
                'https://api.hubapi.com/oauth/v1/refresh-tokens/' + resp.data.refresh_token,
                get_options,
            );
            //#todo temporarily using user email for tenant alias rather than id
            // as the db does not support number tenant alias currently
            hubspotID = get_user_id.data.hub_id;

            // #todo in a seperate ticket check first whether the user already exists in DB
            AddTokensToDatabase(hubspotID.toString(), resp.data.access_token, resp.data.refresh_token);

            // store user id in local tokenStore for knowledge of current user
            // and for knowing which user to poll the DB

            res.redirect('/hubspot?hubspotID=' + hubspotID);
        } catch (e) {
            console.error(e);
        }
    }
    // Log error if no code received
    else {
        console.error('HubSpot OAuth callback did not receive temp access code.');
    }
});

// 5. Send user to authorization page if unsuccessful or create access token and close popup
router.get('/hubspot', async (req, res) => {
    const hubspotID = req.query.hubspotID;
    if (hubspotID) {
        try {
            const frontendToken = generateAccessToken(hubspotID as string);
            res.status(200).send(
                `<script>document.cookie="frontendToken=${frontendToken}; SameSite=None; Secure"; window.close();</script>`,
            );
        } catch (e) {
            console.error(e);
        }
    } else {
        // If not authorized, send to auth url
        if (HUBSPOT_AUTH_URL) {
            res.redirect(HUBSPOT_AUTH_URL);
        } else {
            console.error('env AUTH_URL is undefined.');
        }
    }
});

// Test route, delete later
router.get('/saasquatch_token', async (req, res) => {
    try {
        const token = await getSaasquatchToken();
        res.send(token);
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

// Test route, delete later
router.get('/hubspot_refresh_token', async (req, res) => {
    try {
        const tokens: IntegrationTokens = await PollTokensFromDatabase(hubspotID);
        const token = await getHubspotAccessToken(tokens.refreshToken);
        res.send(token);
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

export const HubApiCall = async function (myapifunc: () => Promise<any>, refresh_token: string): Promise<any> {
    // first try to see if the api call goes through if it does then send response back
    try {
        const result = await myapifunc();
        // api call went through everything is fine
        return result;
    } catch (e) {
        try {
            //error in the api call get a new access token
            const result = await getHubspotAccessToken(refresh_token);
            if (result.status == 400) {
                //result.response.status == 400)
                if (process.env.NODE_ENV == 'test') {
                    // return error result for the testing purpose
                    return result;
                } else {
                    //below is equivalent to rejecting promise return Promise.reject(400 /*or Error*/ );
                    return JSON.parse(result);
                }
            }
            // there was no error so we can store the result.
            else {
                // #todo: Update the line below configure with DB
                tokenStore[hubspotID] = { access_token: result };
                return await HubApiCall(myapifunc, refresh_token);
                // over here we probably want to call the ApiCall again with the same arguments
                // or we want to redirect to the url we were called from
            }
        } catch (e) {
            //something went wrong?
            return Promise.reject(400 /*or Error*/);
        }
    }
};
export function get_current_user(): string {
    return hubspotID;
}

export default router;
