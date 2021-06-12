import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import jwksRsa = require("jwks-rsa");
import { Base64 } from "js-base64";
import bodyParser = require('body-parser');
import { type } from 'os';

/**
 * Handles Webhooks from SaaSquatch and Hubspot
 */

const router = Router();

// Endpoint for listening for webhooks from SaaSquatch
router.post("/saasquatch-webhook", async (req, res) => {
    console.log(req.body);
    const jwsNoPayloadHeader: string | undefined = req.get("X-Hook-JWS-RFC-7797");
    if (jwsNoPayloadHeader){
        validateSaaSquatchWebhook(JSON.stringify(req.body), jwsNoPayloadHeader)
        .then(decoded =>{
            console.log(decoded);
            /**
             * Here you would process webhook. ie. determine "type" and from there post to 
             * Hubspot API with update, etc.
             */
            res.status(200).end();
        })
        .catch(error => {
            console.log("Could not verify sender as SaaSquatch.");
            console.error(error);
            res.status(500).end();
        });
    }else{
        res.status(401).end();
    }
});


// Placeholder for hubspot webhook validation
router.post("/hubspot-webhook", async (req, res) => {
    res.status(200).send("Not yet implemented.");
});


/**
 * Verifying a Webhook Payload: 
 * 
 * 1. Ensure the X-Hook-JWS-RFC-7797 header exists. If it doesn't exist, this request didn't come from SaaSquatch.
 * 2. Look up the SaaSquatch JWKS at http://app.referralsaasquatch.com/.well-known/jwks.json. This contains the 
 *    public keys, and should have a kid that matches the JWS Header of the JWS. The JWKS changes regularly and 
 *    should not be cached in its entirety. 
 * 3. Grab the JSON body from the request. This should always be JSON.
 * 4. Use a JWT library to verify the body matches the signature.
 * 
 * REF: https://docs.saasquatch.com/api/webhooks/security/
 * 
 */

 const saasquatchJwksClient = jwksRsa({
    jwksUri: "https://app.referralsaasquatch.com/.well-known/jwks.json",
    cache: true,
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
 * Validate a webhook coming from SaaSquatch.
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

export default router;