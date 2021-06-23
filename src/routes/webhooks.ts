require('dotenv').config();
import { Router } from 'express';
import * as jwt from "jsonwebtoken";
import jwksRsa = require("jwks-rsa");
import { Base64 } from "js-base64";
import crypto from "crypto";
import { SubscriptionType, HubspotPayload, SaasquatchPayload, EventType } from '../Types/types';
import saasquatchSchema from '../Types/saasquatch-payload-schema.json';
import hubspotSchema from '../Types/hubspot-payload-schema.json';
import Ajv from "ajv";
import { hubspotUpdatesController } from '../integration/hubspotUpdatesController';
import { saasquatchUpdatesController } from '../integration/saasquatchUpdatesController';

//#TODO REPLACE WITH CALL TO DB ONCE ACCESS TOKENS ARE STORED IN DB
import {tokenStore} from "../routes/oath";
import {current_user} from "../routes/oath"

/**
 * Handles Webhooks from SaaSquatch and Hubspot by validating they actually came from SaaSquatch
 * or HubSpot
 */

const router = Router();

const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_WEBHOOK_URI = process.env.HUBSPOT_WEBHOOK_URI;
const SAASQUATCH_JWKS_URI = process.env.SAASQUATCH_JWKS_URI;

let saasquatchJwksClient: jwksRsa.JwksClient;
if(SAASQUATCH_JWKS_URI){
    saasquatchJwksClient = jwksRsa({
        jwksUri: SAASQUATCH_JWKS_URI,
        cache: false,
    });
}else{
    console.error("SAASQUATCH_JWKS_URI is not defined in environment variables and is required for SaaSquatch Webhooks.\
     For staging this should be https://staging.referralsaasquatch.com/.well-known/jwks.json.");
}
// Replace with access token from OAuth when DB set up
// # todo: the saasquatch controller appears to use the HAPI key will need to verify
// # todo: whether that can be replaced with hub access token
if (!process.env.HAPIKEY || !process.env.SAPIKEY || !process.env.STENANTALIAS) {
    throw new Error('Missing environment variable.')
}

// JSON schema validator
const ajv: any = new Ajv();
ajv.addSchema(hubspotSchema, "hubspot");
ajv.addSchema(saasquatchSchema, "saasquatch");

const validateHubspotSchema = ajv.getSchema("hubspot");
const validateSaasquatchSchema = ajv.getSchema("saasquatch");
const hubUpdatesController = new hubspotUpdatesController(tokenStore[current_user]["access_token"], process.env.SAPIKEY, process.env.STENANTALIAS);
const saasUpdatesController = new saasquatchUpdatesController(process.env.HAPIKEY, process.env.SAPIKEY, process.env.STENANTALIAS);



/**
 * Endpoint for webhooks from SaaSquatch
 */ 
router.post("/saasquatch-webhook", async (req, res) => {
    const jwsNoPayloadHeader: string | undefined = req.get("X-Hook-JWS-RFC-7797");
    if (!jwsNoPayloadHeader){
        res.status(401).end();
        return;
    }
    // Verify request came from SaaSquatch
    validateSaaSquatchWebhook(JSON.stringify(req.body), jwsNoPayloadHeader)
    .then(decoded =>{
        // Validate JSON format with schema
        // Note: this does not validate fields or format within the 'data' object as this varies greatly between webhooks.
        if(!validateSaasquatchSchema(decoded)){
            console.error("Request body is invalid in format and does not match expected SaaSquatch schema");
            console.error("Failed at "+ validateSaasquatchSchema.errors);
            res.status(400).end();
            return;
        }
        res.status(200).end();

        // Map to interface
        const saasquatchPayload = decoded as SaasquatchPayload;
        //console.log(saasquatchPayload);

        processSaasquatchPayload(saasquatchPayload);

    })
    .catch(error => {
        console.warn("Received invalid SaaSquatch Webhook.")
        console.error(error);
        res.status(500).end();
    });
    
});

/**
 * Endpoint for webhooks from HubSpot
 */
router.post("/hubspot-webhook", async (req, res) => {
    const signatureVersion = req.get("X-HubSpot-Signature-Version");
    const signature = req.get("X-HubSpot-Signature");
    if (!(signatureVersion && signature)){
        res.status(401).end();
        return;
    }
    // Verify request came from HubSpot
    const isValid: boolean = validateHubSpotWebhook(signatureVersion, signature, JSON.stringify(req.body));
    if (!isValid){
        console.warn("Received invalid HubSpot Webhook.")
        res.status(401).end();
        return;
    }
    // Validate JSON format with schema
    if(!validateHubspotSchema(req.body)){
        console.error("Request body is invalid in format and does not match expected HubSpot schema.");
        console.error("Failed at "+ validateHubspotSchema.errors);
        res.status(400).end();
        return;
    }
    res.status(200).end();
    //console.log(req.body);

    // Sort payload by time occured. ie. contact creation should come before contact property change
    req.body.sort((a: HubspotPayload, b: HubspotPayload) => a.occurredAt < b.occurredAt ? -1 : 1 );
    // Map each object to interface and process subscription type
    req.body.forEach( (hubspotPayload: HubspotPayload) => {
        processHubspotPayload(hubspotPayload);
    });
    
});

function processSaasquatchPayload(saasquatchPayload: SaasquatchPayload) {  
    switch(saasquatchPayload.type){
        case EventType.UserCreated:
            saasUpdatesController.NewUser(saasquatchPayload);
            break;
        case EventType.Test:
            saasUpdatesController.Test(saasquatchPayload);
            break;
        default:
            console.error("No matching EventType. May not yet be implemented.\
             Received type: "+saasquatchPayload.type);

    }
}


function processHubspotPayload(hubspotPayload: HubspotPayload) {  
    switch (hubspotPayload.subscriptionType){
        case SubscriptionType.ContactCreation:
            hubUpdatesController.NewContact(hubspotPayload);
            break;
        case SubscriptionType.ContactDeletion:
            hubUpdatesController.DeletedContact(hubspotPayload);
            break;
        case SubscriptionType.ContactPropertyChange:
            hubUpdatesController.ChangedContact(hubspotPayload);
            break;
        default:
            console.error("No matching subscriptionType. May not yet be implemented.\
             Received subscriptionType: "+hubspotPayload.subscriptionType);
    }
}





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
    if(webhookBody) sourceString += webhookBody;
    const hash = crypto.createHash('sha256').update(sourceString).digest('hex');
    return hash == signature;
}


export default router;