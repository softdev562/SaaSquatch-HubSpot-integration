import { HubspotPayload } from "../Types/types";

/**
 * Sample boilerplate functions
 */

/**
 * Received webhook of subscription type 'contact.created'
 * @param hubspotPayload Payload of Hubspot webhook
 */
export function NewContact(hubspotPayload: HubspotPayload){
    console.log('received HubSpot contact.creation');
    /**
     * TODO:
     * Steps
     * 1. Check if contact exists as user in SaaSquatch (match by email)
     * 2. If it does not exist, create new user in SaaSquatch
     * 3. If it does exist, get referral link and other relevant data
     *  a) post referral link back to hubspot to add to contact
     * 4. Done?
     */
}

/**
 * Received webhook of subscription type 'contact.deletion'
 * @param hubspotPayload Payload of Hubspot webhook
 */
 export function DeletedContact(hubspotPayload: HubspotPayload){
    console.log('received HubSpot contact.deletion');
    /**
     * TODO:
     * Steps
     * 1. Check if contact exists as user in SaaSquatch (match by email)
     * 2. If it does not exist, do nothing
     * 3. If it does exist, post to hubspot to delete user?
     * 4. Done?
     */
}


/**
 * Received webhook of subscription type 'contact.propertyChange'
 * @param hubspotPayload Payload of Hubspot webhook
 */
 export function ChangedContact(hubspotPayload: HubspotPayload){
    console.log('received HubSpot contact.propertyChange');
    /**
     * TODO:
     * Steps
     * 1. Check if contact exists as user in SaaSquatch (match by email)
     * 2. If it does not exist, do nothing? or create contact?
     * 3. If it does exist, update properties
     * 4. Done?
     */
}