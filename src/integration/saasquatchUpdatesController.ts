import { str } from "ajv";
import { SaasquatchPayload } from "../Types/types";
import { HubspotApiModel } from "./HubspotApiModel";
import { SaasquatchApiModel } from "./SaasquatchApiModel";

export class saasquatchUpdatesController{

    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;


	constructor(hApiKey: string, sApiKey: string, sTenantAlias: string){
		this.saasApiModel = new SaasquatchApiModel();
		this.hubApiModel = new HubspotApiModel();
	}



    /**
     * Received webhook of event type 'user.created'
     * @param saasquatchPayload Payload of SaaSquatch webhook
     */
    public async NewUser(saasquatchPayload: any){
        console.log('Received SaaSquatch user.created.');
        console.log(saasquatchPayload);
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
            var programShareLinks: { [key: string]: any } = {};
            for (const key in saasquatchPayloadData.programShareLinks){
                let newProgramShareLinkName = key.replace(/\W/g, '') + "saasquatch_program";
                let newProgramShareLinkLabel = key.replace(/\W/g, '') + " Saasquatch Program";
                if(!await this.hubApiModel.objectHasProperty("contacts", newProgramShareLinkName)){
                    await this.hubApiModel.createObjectProperty("contacts", newProgramShareLinkName, newProgramShareLinkLabel, "string", "textarea", "contactinformation");
                }
                programShareLinks[newProgramShareLinkName] = saasquatchPayloadData.programShareLinks[key].cleanShareLink;
               };
              
               
               const basicContactInfo = {
                "email": saasquatchPayloadData.email,
                "firstname": saasquatchPayloadData.firstName,
                "lastname": saasquatchPayloadData.lastName,
            }
            const basicInfoAndProgramShareLinks = Object.assign(basicContactInfo, programShareLinks);
            const createContactBody = {
                "properties": basicInfoAndProgramShareLinks
            }
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