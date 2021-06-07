import { Router } from 'express'
require('dotenv').config();
import axios from 'axios';
import querystring from 'querystring';



const router = Router()

// env constants
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = process.env.AUTH_URL;

// Temp token store, 
// TODO: move to Firebase DB?
const tokenStore: any = {};

const isAuthorized = (userId: string) =>{
    return tokenStore[userId] ? true : false;
};


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
        if(AUTH_URL){
            res.redirect(AUTH_URL);
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
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        };
        try {
            const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof));
            // 4.Get access and refresh tokens
            tokenStore[req.sessionID] = responseBody.data.access_token;
            res.redirect('/hubspot');

        } catch(e){
            console.error(e);
        }
    }
    // Try oauth flow again if no code received
    else{
        res.redirect('/hubspot');
    }
})


export default router