import { SaasquatchPayload } from "../Types/types";


/**
 * Sample boilerplate functions
 */



/**
 * Received webhook of event type 'user.created'
 * @param saasquatchPayload Payload of SaaSquatch webhook
 */
export function NewUser(saasquatchPayload: SaasquatchPayload){
    console.log('Received SaaSquatch user.created. This is not yet implemented.');
    
    /**
     * TODO:
     * Steps
     * 1. Check if user exists as contact in HubSpot (match by email)
     * 2. If it does not exist, create new contact in HubSpot
     * 3. If it does exist, send referral link to HubSpot for that contact.
     * 4. Done?
     */
}


/**
 * Received webhook of event type 'test'. No processing required as this is a test webhook.
 * 
 * @param saasquatchPayload Payload of SaaSquatch webhook
 */
 export function Test(saasquatchPayload: SaasquatchPayload){
    console.log('Received SaaSquatch test webhook.');  
}