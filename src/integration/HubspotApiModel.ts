import axios from "axios";
import querystring from 'querystring';


export class HubspotApiModel {

    
    // Temp access until DB has OAuth access tokens
    // private HAPIKEY: string;
    //
    // constructor(apiKey: string){
    //     this.HAPIKEY = apiKey;
    // }

   //Temp access until DB has OAuth access tokens
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

    //#todo: suggest renaming objectID to contactObjectID
    public async getContact(objectId: number, paramToGet?: string){
        //const headers = { accept: 'application/json' };
        const headers = { accept: 'application/json',authorization:'Bearer'+ };

        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(objectId)}`;
        let qs;
        if (paramToGet){
            qs = {"properties": 'email', "archived": 'false'}//,// "hapikey": `${this.HAPIKEY}`};
        }
        else{
            qs = {archived: 'false'}//, hapikey: this.HAPIKEY};
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


   

}