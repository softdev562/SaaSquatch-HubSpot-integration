import { Router } from 'express';
require('dotenv').config();
import axios from 'axios';
import querystring from 'querystring';

const router = Router();

// env constants
// Hubspot
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;
const HUBSPOT_AUTH_URL = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URI}&scope=contacts`;
// Saasquatch
const SAASQUATCH_CLIENT_ID = process.env.SAASQUATCH_CLIENT_ID;
const SAASQUATCH_CLIENT_SECRET = process.env.SAASQUATCH_CLIENT_SECRET;

// Temp token store, 
// TODO: move to Firebase DB?
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
		const resp = await axios.post(url, null, {
			params: {
				grant_type: "refresh_token",
				client_id: HUBSPOT_CLIENT_ID,
				client_secret: HUBSPOT_CLIENT_SECRET,
				refresh_token: refreshToken
			},
			headers: {
				Content_type: "application/x-www-form-urlencoded",
				charset: "utf-8"
			}
		});
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
		const resp = await axios.post(url, body);
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
        // If authorized get contacts from HubSpot API
        const accessToken = tokenStore[req.sessionID]["access_token"];
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        const contacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/recent';
        try{
            const resp = await axios.get(contacts, {"headers": headers});
            res.status(200).send(resp.data);
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
            const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof));
            // 4.Get access and refresh tokens
            tokenStore[req.sessionID] = {"access_token": responseBody.data.access_token, "refresh_token": responseBody.data.refresh_token};
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
		res.send(token)
	} catch(e) {
		console.log(e);
		res.send(e)
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