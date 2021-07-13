import axios from "axios";
import {get_current_user} from "../routes/oath";
import {isAuthorized} from "../routes/oath";
import {PollTokensFromDatabase} from "../database";
const querystring = require('query-string');
import {tokenStore} from "../routes/oath";



export class HubspotApiModel {

    constructor(){

    }

    /**
     * Gets contact from HubSpot.
     * 
     * @param objectId objectID of contact to query
     * @param paramToGet query parameters to filter by. eg. 'email'.
     */

    //#todo: suggestion renaming objectID to contactObjectID
    public async getContact(objectId: number, paramToGet?: string){

        console.log("this is current user ", get_current_user());
        let token:any = await PollTokensFromDatabase(get_current_user());
        let access_token = token.accessToken;


        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(objectId)}`;

        const options = {
            qs: {"properties": 'email', "archived": 'false'},
            headers: { accept: 'application/json',authorization:`Bearer ${access_token}`}
        };

        if (paramToGet){
          const options = {
               qs: {"properties": 'email', "archived": 'false'},
               headers:{ accept: 'application/json',authorization:`Bearer ${access_token}`}
           };
        }
        else{
           // qs = {archived: 'false'}
           const options = {
                qs: {"properties": 'email', "archived": 'false'},
                headers:{ accept: 'application/json',authorization:`Bearer ${access_token}`}
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
        let access_token;
        if(isAuthorized(get_current_user()))
        {
            (async function(){
                try
                {
                    let access_token:any = await PollTokensFromDatabase(get_current_user());
                    console.log(access_token)
                }
                catch(e)
                {
                    console.log(e);
                }
            })();
        }

        try{
            const createObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType;
            const response = await axios.post(createObjectURL, createObjectBody,{

                // #TODO update later
                params: {
                    hapikey: access_token
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
        let access_token;

        if(isAuthorized(get_current_user()))
        {
            (async function(){
                try
                {
                    let access_token:any = await PollTokensFromDatabase(get_current_user());
                    console.log(access_token)
                }
                catch(e)
                {
                    console.log(e);
                }
            })();
        }

        try {
            const response = await axios.post(searchObjectURL,body, {
                params: {
                    // #TODO update later
                    hapikey: access_token,
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