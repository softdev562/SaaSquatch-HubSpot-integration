require('dotenv').config();
import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import jwksRsa = require("jwks-rsa");
import { Base64 } from "js-base64";
import crypto from "crypto";



/**
 * Handles Webhooks from SaaSquatch and Hubspot by validating they actually came from SaaSquatch
 * or HubSpot
 */


const router = Router();

const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_WEBHOOK_URI = process.env.HUBSPOT_WEBHOOK_URI;

const saasquatchJwksClient = jwksRsa({
    jwksUri: "https://app.referralsaasquatch.com/.well-known/jwks.json",
    cache: true,
});



/**
 * Endpoint for webhooks from SaaSquatch
 */ 
router.post("/saasquatch-webhook", async (req, res) => {
    const jwsNoPayloadHeader: string | undefined = req.get("X-Hook-JWS-RFC-7797");
    if (jwsNoPayloadHeader){
        validateSaaSquatchWebhook(JSON.stringify(req.body), jwsNoPayloadHeader)
        .then(decoded =>{
            console.log("Received valid SaaSquatch Webhook.")
            console.log(decoded);
            /**
             * Here you would process the webhook. ie. determine "type" and from there post to 
             * Hubspot API with update, etc.
             * While we can confirm this came from SaaSquatch, they make no guarantees the JSON is 
             * formatted correctly, so we will need to verify that as well.
             */
            res.status(200).end();
        })
        .catch(error => {
            console.warn("Received invalid SaaSquatch Webhook.")
            console.error(error);
            res.status(500).end();
        });
    }else{
        res.status(401).end();
    }
});

/**
 * Endpoint for webhooks from HubSpot
 */
router.post("/hubspot-webhook", async (req, res) => {
    const signatureVersion = req.get("X-HubSpot-Signature-Version");
    const signature = req.get("X-HubSpot-Signature");
    if (signatureVersion && signature){
        const isValid: boolean = validateHubSpotWebhook(signatureVersion, signature, JSON.stringify(req.body));
        if (isValid){
            console.log("Received valid HubSpot Webhook.");
            console.log(req.body);
            /**
             * Here you would process the webhook. ie. determine "type" and from there post to 
             * SaaSquatch API with update, etc.
             * While we can confirm this came from HubSpot, they make no guarantees the JSON is 
             * formatted correctly, so we will need to verify that as well.
             */
            res.status(200).end();
        }
        else{
            console.warn("Received invalid HubSpot Webhook.")
            res.status(401).end();
        }
    }else{
        res.status(401).end();
    }
});




/**
 * Validate the given JWT with SaaSquatch public JWKS and get the claims.
 * 
 * @param token The input JWT
 */
export function validateWithSaaSquatchJwks(token: string): Promise<object> {
    return new Promise((resolve, reject) => {
        jwt.verify(
        token,
        (header, callback) => {
            saasquatchJwksClient.getSigningKey(header.kid, (err, key) => {
                callback(err, key ? key.getPublicKey() : undefined);
            });
        },
        (err, decoded) => {
            if (err) {
                reject(err);
            } else if (decoded){
                resolve(decoded);
            }
        }
    )});
}

/**
 * Verifying a SaaSquatch Webhook Payload: 
 * 1. Ensure the X-Hook-JWS-RFC-7797 header exists. If it doesn't exist, this request didn't come from SaaSquatch.
 * 2. Look up the SaaSquatch JWKS at http://app.referralsaasquatch.com/.well-known/jwks.json. This contains the 
 *    public keys, and should have a kid that matches the JWS Header of the JWS. The JWKS changes regularly and 
 *    should not be cached in its entirety. 
 * 3. Grab the JSON body from the request. This should always be JSON.
 * 4. Use a JWT library to verify the body matches the signature.
 * 
 * REF: https://docs.saasquatch.com/api/webhooks/security/
 *
 * @param webhookBody The raw text of the webhook body.
 * @param jwsNoPayloadHeader The value of the X-Hook-JWS-RFC-7797 header.
 */
export function validateSaaSquatchWebhook(
    webhookBody: string,
    jwsNoPayloadHeader: string
): Promise<object> {
    const webhookBodyBase64 = Base64.encodeURI(webhookBody);
    const token = jwsNoPayloadHeader.replace("..", "." + webhookBodyBase64 + ".");
    return validateWithSaaSquatchJwks(token);
}


/**
 *  Verifying a HubSpot Webhook Payload: 
 * 1. Check the X-HubSpot-Signature and X-HubSpot-Signature-Version headers exists. If these don't, this request 
 *    didn't come from HubSpot.
 * 2. Check the X-HubSpot-Signature-Version for the version.
 * 3. To validate the v1 request signature:
 *      a) Create a string concatinating client_secret and request body
 *      b) Create a SHA-256 hash of the string
 *      c) Compare hash to X-HubSpot-Signature
 * 4. To validate the v2 request signature:
 *      a) Create a string concatinating the Client secret + http method + URI + request body
 *      b) Create a SHA-256 hash of the string
 *      c) Compare hash to X-HubSpot-Signature
 * 
 * REF: https://developers.hubspot.com/docs/api/webhooks/validating-requests
 *
 * @param webhookBody The raw text of the webhook body.
 * @param signatureVersion The value of the X-HubSpot-Signature-Version header.
 * @param signature The value of the X-HubSpot-Signature header
 */
 export function validateHubSpotWebhook(signatureVersion: string, signature: string, webhookBody?: string) {
    if(!HUBSPOT_CLIENT_SECRET){
        console.error("Missing HUBSPOT_CLIENT_SECRET in env variables. The HUBSPOT_CLIENT_SECRET is required to \
        validate HubSpot Webhooks.");
        return false;
    }
    var sourceString: string;
    // If X-HubSpot-Signature header is version 1
    if(signatureVersion == 'v1'){
        sourceString = HUBSPOT_CLIENT_SECRET;

    }
    // If X-HubSpot-Signature header is version 2
    else if(signatureVersion == 'v2'){
        if(!HUBSPOT_WEBHOOK_URI){
            console.error("HUBSPOT_WEBHOOK_URI missing in env variables. The HUBSPOT_WEBHOOK_URI is required to \
            validate Version 2 X-HubSpot-Signatures.");
            return false;
        }
        const uri = encodeURI(HUBSPOT_WEBHOOK_URI);
        sourceString = HUBSPOT_CLIENT_SECRET + "POST" + uri;
    }
    // If X-HubSpot-Signature header is missing webhook is invalid.
    else{
        console.error("Invalid or missing X-HubSpot-Signature-Version header.");
        return false;
    }

    if(webhookBody) sourceString + webhookBody;
    const hash = crypto.createHash('sha256').update(sourceString).digest('hex');
    return hash == signature;
}


export default router;