import axios from "axios";
import {get_current_user} from "../routes/oath";
import {PollTokensFromDatabase} from "../database";

/**
 * HubSpot model for interacting with the HubSpot's API
 */

export class HubspotApiModel {

    /**
     * Gets contact from HubSpot.
     * 
     * @param objectId objectID of contact to query
     * @param paramToGet query parameters to filter by. eg. 'email'.
     */
    public async getContact(contactObjectID: number, paramToGet?: string){
        console.log("this is current user ", get_current_user());
        let token:any = await PollTokensFromDatabase(get_current_user());
        let access_token = token.accessToken;
        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactObjectID)}`;

        let options: any = {
            qs: {"properties": 'email', "archived": 'false'},
            headers: {accept: 'application/json',authorization:`Bearer ${access_token}`}
        };
        if (paramToGet){
            options = {
               qs: {"properties": 'email', "archived": 'false'},
               headers:{ accept: 'application/json',authorization:`Bearer ${access_token}`}
            };
        }
        else{
            options = {
                qs: {"archived": 'false'},
                headers:{accept: 'application/json',authorization:`Bearer ${access_token}`}
            };
        }
        try{
            const resp = await axios.get(url, options);
            if (resp.status != 200) {
                throw Error("Error getting a contact from HubSpot." + resp.data["error"]);
            }
            else{
                return resp.data;
            }
        }catch(e){
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
        let token:any = await PollTokensFromDatabase(get_current_user());
        let access_token = token.accessToken;

        try{
            const createObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType;
            const response = await axios.post(createObjectURL, createObjectBody,{
                params: {
                    headers:{ accept: 'application/json',authorization:`Bearer ${access_token}`}
                }
            });
            return response;
        } catch (e) {
            console.error("Was not able to create contact");
            console.log(e);
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
        console.log("this is current user ", get_current_user());
        let token:any = await PollTokensFromDatabase(get_current_user());
        let access_token = token.accessToken;

        try {
            const response = await axios.post(searchObjectURL,body, {
                params: {
                    headers:{ accept: 'application/json',authorization:`Bearer ${access_token}`}
            }});
            return response;
        } catch (e) {
            console.error("===== WAS NOT ABLE TO SEARCH FOR PROPERTIES OF OBJECT: " + objectType);
            console.error(e);
        }
    }
}