import { Router } from 'express'
require('dotenv').config();
import axios from 'axios';
import querystring from 'querystring';


const router = Router()

// env constants
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;
const HUBSPOT_AUTH_URL = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URI}&scope=contacts`;


// Temp token store, 
// TODO: move to Firebase DB?
const tokenStore: any = {};

const isAuthorized = (userId: string) =>{
    return tokenStore[userId] ? true : false;
};

// Get new access token from Hubspot
// returns null if error
const newHubspotAccessToken = async (sessionId: string) => {
	try {
		const url = "https://api.hubapi.com/oauth/v1/token";
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			"charset": "utf-8"
		};
		const data = {
			"grant_type": "refresh_token",
			"client_id": HUBSPOT_CLIENT_ID,
			"client_secret": HUBSPOT_CLIENT_SECRET,
			"refresh_token": tokenStore[sessionId]["refresh_token"]
		}
		const resp = await axios.post(url, {headers, data});
		if (resp.status != 200) {
			console.log(resp.data["message"]);
		}
		return resp.data["refresh_token"];
	} catch(e) {
		console.log(e);
		return null;
	}
}

// Start HubSpot OAuth flow
// 1. Send user to authorization page
router.get('/hubspot', async (req, res) => {
    if(isAuthorized(req.sessionID)) {
        // If authorized get contacts from HubSpot API
        const accessToken = tokenStore[req.sessionID];
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
        const contacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/recent';
        try{
            const resp = await axios.get(contacts, {headers});
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
            console.error("env AUTH_URL is undefined.")
        }
    }
})

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
        console.error("HubSpot OAuth callback did not receive temp access code.")
    }
})

export default router