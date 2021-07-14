import { HubspotPayload } from "../Types/types";
import { HubspotApiModel } from "./HubspotApiModel";
import { SaasquatchApiModel } from "./SaasquatchApiModel";
import { LookupAlias as LookupAlias } from "../database";


export class hubspotUpdatesController{

    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;

    constructor(hApiKey: string, sApiKey: string, sTenantAlias: string){
        this.saasApiModel = new SaasquatchApiModel();
        this.hubApiModel = new HubspotApiModel(hApiKey);
    }

    
   
    /**
     * Received webhook of subscription type 'contact.created'. Create a new contact in Saasquatch.
	 * 
     * @param hubspotPayload Payload of Hubspot webhook
     */
    public async NewContact(hubspotPayload: HubspotPayload) {
        const contactObjectId: number = hubspotPayload.objectId;
    
        // Hubspot does not include email in contact.created
        // Get new contact's email
        let params ='';
		try {
        	const participant = await this.hubApiModel.getContact(contactObjectId);

            params = `email:${encodeURIComponent(participant.properties.email)}`;

			// Get tenant alias of the corresponding saasquatch tenant to the hubspot account.
			const tenantAlias = await LookupAlias(hubspotPayload.portalId.toString());
			if (tenantAlias === "") {
				throw new Error("No tenantAlias associated with this Hubspot account.")
			}

            // 1. Check if contact exists as user in SaaSquatch (match by email)
            const data = await this.saasApiModel.getUsers(params);

			// 2. If it does not exist, create new user in SaaSquatch
			if(data.count == 0){
				const createParticipantBody = {
						"email": participant.properties.email,
						"firstName": participant.properties.firstname,
						"lastName": participant.properties.lastname,
						"id": participant.properties.email,
						"accountId": participant.properties.email,
				};
				await this.saasApiModel.createParticipant(tenantAlias, participant.properties.email, createParticipantBody);
			}

			// 3. TODO: If it does exist, get share link and other relevant data
			else{
				console.log("SAAS USER "+data.users[0].email);
				console.log("user share links: "+data.users[0].shareLinks);
			}

			// 4. TODO: send referral link back to hubspot to add to contact
			
		} catch (e) {
			console.error(e)
		}
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