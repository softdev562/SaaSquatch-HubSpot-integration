import axios from "axios";
import querystring from 'querystring';

export class HubspotApiModel {

    
    // Temp access until DB has OAuth access tokens
    private HAPIKEY: string;

    constructor(apiKey: string){
        this.HAPIKEY = apiKey;
    }

    /**
     * Gets contact from HubSpot.
     * 
     * @param objectId objectID of contact to query
     * @param paramToGet query parameters to filter by. eg. 'email'.
     */
    public async getContact(objectId: number, paramToGet?: string){
        const headers = { accept: 'application/json' };
        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(objectId)}`;
        let qs;
        if (paramToGet){
            qs = {"properties": 'email', "archived": 'false', "hapikey": `${this.HAPIKEY}`};
        }
        else{
            qs = {archived: 'false', hapikey: this.HAPIKEY};
        }
        try{
            const resp = await axios.get( url, { params: qs } );
            if (resp.status != 200) {
                throw Error("Error getting a contact from HubSpot." + resp.data["error"]);
            }
            else{
                //console.log(resp);
                return resp.data;
            }
        }catch(e){
            console.error(e);
        }
    }

    public async createObject(objectType:string, createContactBody:object){
        try{
            const createContactURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType;
            const response = await axios.post(createContactURL, createContactBody,{
        
                params: {
                    hapikey: this.HAPIKEY
                }
            });
            return response;
        } catch (e) {
            console.error("Was not able to create contact");
            console.log(e);
        }
    }
   


    public async searchObject(objectType:string, body:object){
        const searchURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType + '/search';
        try {
            const response = await axios.post(searchURL,body, {
                params: {
                    hapikey: this.HAPIKEY,
                }
            });
            return response;
        } catch (e) {
            console.error("===== WAS NOT ABLE TO SEARCH FOR PROPERTIES OF OBJECT: " + objectType);
            console.error(e);
        }
    }


   

}