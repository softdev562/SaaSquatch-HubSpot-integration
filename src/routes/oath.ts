import { Router } from 'express';
require('dotenv').config();
import axios from 'axios';
import querystring from 'querystring';

const router = Router();

// Constants
// Hubspot
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;

let HUBSPOT_AUTH_URL: string;
if(HUBSPOT_CLIENT_ID && HUBSPOT_REDIRECT_URI){
    HUBSPOT_AUTH_URL = `https://app.hubspot.com/oauth/authorize?client_id=${encodeURIComponent(HUBSPOT_CLIENT_ID)}&redirect_uri=${encodeURIComponent(HUBSPOT_REDIRECT_URI)}&scope=contacts`;
}else{
    console.error("HUBSPOT_CLIENT_ID:"+HUBSPOT_CLIENT_ID+" or HUBSPOT_REDIRECT_URI:"+HUBSPOT_REDIRECT_URI+" not defined in environment variables.");
}

// Saasquatch
const SAASQUATCH_CLIENT_ID = process.env.SAASQUATCH_CLIENT_ID;
const SAASQUATCH_CLIENT_SECRET = process.env.SAASQUATCH_CLIENT_SECRET;

// Temp token store, 
// TODO: move to Firebase DB
const tokenStore: any = {};

const isAuthorized = (userId: string) =>{
    return tokenStore[userId] ? true : false;
};

// Get new access token from Hubspot
// Return: Access token object or error object.
// Access token object: {"refresh_token", "access_token", "expires_in"}
// Error object: {"message"}
const getHubspotAccessToken = async (refreshToken: string) => {
	// return early if missing some env variables
	if (!HUBSPOT_CLIENT_ID || !HUBSPOT_CLIENT_SECRET) {
		return {message: "ERROR: Hubspot client id or secret missing."};
	}
	try {
		const url = `https://api.hubapi.com/oauth/v1/token`;
        const refreshTokenProof = {
            grant_type: 'refresh_token',
            client_id: HUBSPOT_CLIENT_ID,
            client_secret: HUBSPOT_CLIENT_SECRET,
            refresh_token: refreshToken,
        };
		const resp = await axios.post(url, querystring.stringify(refreshTokenProof));
		return resp.data;
	} catch(e) {
		console.log(e);
		return e;
	}
}

// Gets a new access token from saasquatch
// return: access token object, or error object.
// Access token object: {"access_token", "expires_in", "token_type"}
// Error object: {"error", "error_description"}
const getSaasquatchToken = async () =>  {
	// Return early if missing some env variables.
	if (!SAASQUATCH_CLIENT_ID || !SAASQUATCH_CLIENT_SECRET) {
		return {"error": "Client id/secret error", "error_description": "Client id or secret not provided correctly."};
	}

	const url: string = "https://squatch-dev.auth0.com/oauth/token";
	const grant_type: string = "client_credentials";
	const audience: string = "https://staging.referralsaasquatch.com";

	const body = {
		"grant_type": grant_type,
		"client_id": SAASQUATCH_CLIENT_ID,
		"client_secret": SAASQUATCH_CLIENT_SECRET,
		"audience": audience
	};

	try {
		const resp = await axios.post(url, querystring.stringify(body));
		if (resp.status != 200) {
			console.log(resp.data["error"]);
			return resp.data;
		}
		return resp.data;
	} catch(e) {
		console.log(e);
		return {"error": e, "error_description": e};
	}
};

// Start HubSpot OAuth flow
// 1. Send user to authorization page
router.get('/hubspot', async (req, res) => {
    if(isAuthorized(req.sessionID)) {
        try {
            res.status(200).send("<script>window.opener.location = 'https://app.hubspot.com'; window.close();</script>");
        }
        catch(e){
            console.error(e);
        }
    } else{
        // If not authorized, send to auth url
        if(HUBSPOT_AUTH_URL){
            res.redirect(HUBSPOT_AUTH_URL);
        }else{
            console.error("env AUTH_URL is undefined.");
        }
    }
});

// 2. Get temporary authorization code from OAuth server
// 3. Combine temporary auth code with app credentials and send back to OAuth server
router.get('/oauth-callback', async (req, res) => {
    // If temp authorization code was received
    if(req.query.code){
        const code: any = req.query.code;
        const authCodeProof = {
            grant_type: 'authorization_code',
            client_id: HUBSPOT_CLIENT_ID,
            client_secret: HUBSPOT_CLIENT_SECRET,
            redirect_uri: HUBSPOT_REDIRECT_URI,
            code: code
        };
        try {
            // 4.Get access and refresh tokens
            const resp = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof));
            if (resp.status != 200) {
                throw Error("POST to get access and refresh tokens from HubSpot failed. Error:" + resp.data["error"]);
            }
            tokenStore[req.sessionID] = {"access_token": resp.data.access_token, "refresh_token": resp.data.refresh_token};
            res.redirect('/hubspot');
        } catch(e){
            console.error(e);
        }
    }
    // Log error if no code received
    else{
        console.error("HubSpot OAuth callback did not receive temp access code.");
    }
});

// Test route, delete later
router.get("/saasquatch_token", async (req, res) => {
	try {
		const token = await getSaasquatchToken();
		res.send(token);
	} catch(e) {
		console.log(e);
		res.send(e);
	}
});

// Test route, delete later
router.get("/hubspot_refresh_token", async (req, res) => {
	try {
		const token = await getHubspotAccessToken(tokenStore[req.sessionID]["refresh_token"]);
		res.send(token);
	} catch(e) {
		console.log(e);
		res.send(e);
	}
});

export default router