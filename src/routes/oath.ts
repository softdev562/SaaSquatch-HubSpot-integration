import { Router } from 'express';
require('dotenv').config();
import axios from 'axios';
const querystring = require('query-string');
//import querystring from 'querystring';

const router = Router();

let current_user:any ='VALUE_ASSIGNED_IN_HUBSPOT_ENDPOINT'; // current_user = req.SessionID
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
export const tokenStore: any = {};

export const isAuthorized = (userId: string) =>{
    return tokenStore[userId] ? true : false;
};

// Gets a new access token from Hubspot
// Input: Hubspot account refresh token.
// Return: {"refresh_token", "access_token", "expires_in"}, else if error {"status", "statusText"}
export const getHubspotAccessToken = async (refreshToken: string) => {
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
	} catch(e) {
		console.error(`Request to '${e.config.url}' resulted in error ${e.response.status} ${e.response.statusText}.`);
		return {status: e.response.status, statusText: e.response.statusText};
	}
}

// Gets a new JWT from saasquatch
// Input: None.
// Return: {"access_token", "expires_in", "token_type"}, else if error {"status", "statusText"}
export const getSaasquatchToken = async () =>  {
	try {
		const url = "https://squatch-dev.auth0.com/oauth/token";
		const tokenProof = {
			"grant_type": "client_credentials",
			"client_id": SAASQUATCH_CLIENT_ID,
			"client_secret": SAASQUATCH_CLIENT_SECRET,
			"audience": "https://staging.referralsaasquatch.com"
		};
		const resp = await axios.post(url, querystring.stringify(tokenProof));
		return resp.data;
	} catch(e) {
		console.error(`Request to '${e.config.url}' resulted in error ${e.response.status} ${e.response.statusText}.`);
		return {status: e.response.status, statusText: e.response.statusText};
	}
};

// Start HubSpot OAuth flow
// 1. Send user to authorization page
router.get('/hubspot', async (req, res) => {
    if(isAuthorized(req.sessionID)) {
        try {
            res.status(200).send("<script>window.opener.location = 'http://localhost:3000/configuration'; window.close();</script>");
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
            current_user = req.sessionID;
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
	}
});

// Test route, delete later
router.get("/hubspot_refresh_token", async (req, res) => {
	try {
		const token = await getHubspotAccessToken(tokenStore[req.sessionID]["refresh_token"]);
		res.send(token);
	} catch(e) {
		console.log(e);
	}
});


export const HubApiCall:any = async function (myapifunc:Function,refresh_token:string)
{
	// first try to see if the api call goes through if it does then send response back
	try
	{
		let result = await myapifunc()
		// api call went through everything is fine
		return result;
	}
	catch(e)
	{
		try
		{
			//error in the api call get a new access token
			let result = await getHubspotAccessToken(refresh_token);
			if(result.status ==400)//result.response.status == 400)
			{
				if(process.env.NODE_ENV == 'test')
				{
					// return error result for the testing purpose
					return result;
				}
				else
				{
				//below is equivalent to rejecting promise return Promise.reject(400 /*or Error*/ );
					return JSON.parse(result);
				}
			}
			else
				// there was no error so we can store the result.
			{
				// #todo: Update the line below configure with DB
				tokenStore[current_user] = {"access_token": result};
				return await HubApiCall(myapifunc,refresh_token);
				// over here we probably want to call the ApiCall again with the same arguments
				// or we want to redirect to the url we were called from
			}
		}
		catch(e)
		{
			//something went wrong?
			return Promise.reject(400 /*or Error*/ );
		}
	}
}




export default router