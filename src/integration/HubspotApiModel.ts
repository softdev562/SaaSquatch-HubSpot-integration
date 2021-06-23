import axios from "axios";
import querystring from 'querystring';


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
        const headers = { accept: 'application/json',authorization:`Bearer ${this.hub_access_token}` };
        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(objectId)}`;
        let qs;
        if (paramToGet){
            qs = {"properties": 'email', "archived": 'false'}
        }
        else{
            qs = {archived: 'false'}
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
            // this causes a promise rejection to be sent (necessary for integration with hubapicallfun)
            return JSON.parse(e.response.body);
            console.error(e);
        }
    }


   

}