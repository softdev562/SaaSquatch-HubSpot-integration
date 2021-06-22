import { HubspotPayload } from "../Types/types";
import { HubspotApiModel } from "./HubspotApiModel";
import { SaasquatchApiModel } from "./SaasquatchApiModel";


export class hubspotUpdatesController{

    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;

    constructor(hApiKey: string, sApiKey: string, sTenantAlias: string){
        this.saasApiModel = new SaasquatchApiModel(sApiKey, sTenantAlias);
        this.hubApiModel = new HubspotApiModel(hApiKey);
    }

    /**
     * Received webhook of subscription type 'contact.created'
     * @param hubspotPayload Payload of Hubspot webhook
     */
    public NewContact(hubspotPayload: HubspotPayload){
        console.log('received HubSpot contact.creation');
        
        const contactObjectId: number = hubspotPayload.objectId;
        console.log("New contact obj id: "+contactObjectId);
    
        // Hubspot does not include email in contact.created
        // Get new contact's email
        let params ='';
        this.hubApiModel.getContact(contactObjectId, 'email')
        .then(data =>{
            console.log("response");
            console.log(data);
            params = `email:${encodeURIComponent(data.properties.email)}`;
            console.log(params);
            // 1. Check if contact exists as user in SaaSquatch (match by email)
            this.saasApiModel.getUsers(params)
            .then( data =>{
                // 2. TODO: If it does not exist, create new user in SaaSquatch
                if(data.count == 0){
                    console.log("User does not exist in SaaSquatch");
                }
                // 3. TODO: If it does exist, get share link and other relevant data
                else{
                    console.log("SAAS USER "+data.users[0].email);
                    console.log("user share links: "+data.users[0].shareLinks);
                }

                // 4. TODO: send referral link back to hubspot to add to contact
            
                }
    
            );
        });
        //console.log("contact email: "+ contactEmail);
        // const params = `email:${contactEmail}`;
        console.log(params);
    }
    
    
    
    /**
     * Received webhook of subscription type 'contact.deletion'
     * @param hubspotPayload Payload of Hubspot webhook
     */
    public DeletedContact(hubspotPayload: HubspotPayload){
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
    public ChangedContact(hubspotPayload: HubspotPayload){
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


}