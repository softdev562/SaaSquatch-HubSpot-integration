import axios from "axios";
const querystring = require('query-string');


export class HubspotApiModel {
    private hub_access_token: string;

    constructor(hub_access_token: string){
        this.hub_access_token = hub_access_token;
    }

    /**
     * Gets contact from HubSpot.
     * 
     * @param objectId objectID of contact to query
     * @param paramToGet query parameters to filter by. eg. 'email'.
     */

    //#todo: suggestion renaming objectID to contactObjectID
    public async getContact(objectId: number, paramToGet?: string){
        ///const header = { accept: 'application/json',authorization:`Bearer ${this.hub_access_token}` };
        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(objectId)}`;
        //const url = `https://api.hubapi.com/crm/v3/objects/contacts/${objectId}`;

        const options = {
            qs: {"properties": 'email', "archived": 'false'},
            headers: { accept: 'application/json',authorization:`Bearer ${this.hub_access_token}`}
        };

        if (paramToGet){
          const options = {
               qs: {"properties": 'email', "archived": 'false'},
               headers:{ accept: 'application/json',authorization:`Bearer ${this.hub_access_token}`}
           };
        }
        else{
           // qs = {archived: 'false'}
           const options = {
                qs: {"properties": 'email', "archived": 'false'},
                headers:{ accept: 'application/json',authorization:`Bearer ${this.hub_access_token}`}
            };

        }
        try{
            const resp = await axios.get( url, options);
            if (resp.status != 200) {
                throw Error("Error getting a contact from HubSpot." + resp.data["error"]);
            }
            else{
                return resp.data;
            }
        }catch(e){
            // this causes a promise rejection to be sent (necessary for integration with hubapicallfun)
          //  return JSON.parse(e.response.body);
            console.error(e);
        }
    }

    /**
     * Creates an object in Hubspot
     * 
     * @param objectType object type to be created. e.g. deals, contacts, company
     * @param createObjectBody body specifiying the create properties of the object
     * @returns axios response
     */
    public async createObject(objectType:string, createObjectBody:object){
        try{
            const createObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType;
            const response = await axios.post(createObjectURL, createObjectBody,{

                // #TODO update later
                params: {
                    hapikey: this.hub_access_token
                }
            });
            return response;
        } catch (e) {
            console.error("Was not able to create contact");
            console.log(e);
            return JSON.parse(e.response.body);
        }
    }
   

    /**
     * 
     * @param objectType object to search for. e.g. deals, contacts, company
     * @param body body specifiying the search properties of the object
     * @returns axios response
     */
    public async searchObject(objectType:string, body:object){
        const searchObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType + '/search';
        try {
            const response = await axios.post(searchObjectURL,body, {
                params: {
                    // #TODO update later
                    hapikey: this.hub_access_token,
                }
            });
            return response;
        } catch (e) {
            console.error("===== WAS NOT ABLE TO SEARCH FOR PROPERTIES OF OBJECT: " + objectType);
            console.error(e);
            return JSON.parse(e.response.body);
        }
    }


   

}