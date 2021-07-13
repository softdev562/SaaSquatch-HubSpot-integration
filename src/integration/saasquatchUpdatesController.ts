import { SaasquatchPayload } from "../Types/types";
import { HubspotApiModel } from "./HubspotApiModel";
import { SaasquatchApiModel } from "./SaasquatchApiModel";

export class saasquatchUpdatesController{

    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;


     constructor(hApiKey: string, sApiKey: string, sTenantAlias: string){
        this.saasApiModel = new SaasquatchApiModel(sApiKey, sTenantAlias);
        this.hubApiModel = new HubspotApiModel();
     }



    /**
     * Received webhook of event type 'user.created'
     * @param saasquatchPayload Payload of SaaSquatch webhook
     */
    public async NewUser(saasquatchPayload: any){
        console.log('Received SaaSquatch user.created.');

        const saasquatchPayloadData = saasquatchPayload.data;
        const contactsSearchBody = {
            filterGroups: [
                {
                    filters: [
                    {
                      "value": saasquatchPayloadData.email, 
                      "propertyName": 'email', 
                      "operator": 'EQ'
                  }
                   ]
                  }
              ],
              limit: 1,

        };
        const contactsSearchResponse = await this.hubApiModel.searchObject("contacts", contactsSearchBody);
         if (contactsSearchResponse?.data.total == 0){
            const createContactBody = {
                "properties":{
                    "email": saasquatchPayloadData.email,
                    "firstname": saasquatchPayloadData.firstName,
                    "lastname": saasquatchPayloadData.lastName,
                }
    
            };
            await this.hubApiModel.createObject("contacts", createContactBody);
         }
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