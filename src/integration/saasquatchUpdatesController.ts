import { SaasquatchPayload } from "../Types/types";
import { HubspotApiModel } from "./HubspotApiModel";
import { SaasquatchApiModel } from "./SaasquatchApiModel";

export class saasquatchUpdatesController{

    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;


     constructor(hApiKey: string, sApiKey: string, sTenantAlias: string){
        this.saasApiModel = new SaasquatchApiModel(sApiKey, sTenantAlias);
        this.hubApiModel = new HubspotApiModel(hApiKey);
     }



    /**
     * Received webhook of event type 'user.created'
     * @param saasquatchPayload Payload of SaaSquatch webhook
     */
    public NewUser(saasquatchPayload: SaasquatchPayload){
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
    public Test(saasquatchPayload: SaasquatchPayload){
        console.log('Received SaaSquatch test webhook.');  
    }

}