import axios from "axios";

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
        
                params: {
                    hapikey: this.HAPIKEY
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
     * @param objectType object to create property to check property for 
     * @param propertyName the name of the property, not the label
     * @returns true if the property exists, otherwise false
     */
    public async objectHasProperty(objectType: string, propertyName: string){
        const readPropertyURL = 'https://api.hubapi.com/crm/v3/properties/' + objectType + '/' + propertyName; 
        try {
         const response = await axios.get(readPropertyURL, {
             params: {
                 hapikey: this.HAPIKEY
             }
         });
            if (response.status==200 ){
                console.log("=== PROPERTY EXIST IN OBJECT TYPE " + objectType + " ===")
                return true; 
            } else {
                console.error("======== WAS NOT ABLE TO READ PROPERTY ========");
                console.error(response);
            }
        } catch (e) {
            if(e.response.status==404){
                console.log("=== PROPERTY DOES NOT EXIST IN OBJECT TYPE " + objectType + " ===")
                return false;
            } else{
                console.error("======== WAS NOT ABLE TO MAKE CALL: STATUS CODE: "+ e.response.status+" ========");
                console.log(e);
                return JSON.parse(e.response.body);
            }
        }
    }


    /**
     * Create a hubspot property for an object
     * 
     * @param objectType object to create property for
     * @param propertyName The internal property name, which must be used when referencing the property via the (hubspot's) API.
     * @param propertyLabel A human-readable property label that will be shown in HubSpot.
     * @param propertyType The data type of the property.
     * @param propertyFieldType Controls how the property appears in HubSpot.
     * @param propertyGroupName The name of the property group the property belongs to.
     * https://developers.hubspot.com/docs/api/crm/properties
     */
    public async createObjectProperty(objectType:string, propertyName: string, propertyLabel:string, propertyType:string, propertyFieldType:string, propertyGroupName: string){
        const contactCreatePropertyURL = 'https://api.hubapi.com/crm/v3/properties/' + objectType;
        const body = {
            "name": propertyName,
            "label": propertyLabel,
            "type": propertyType,
            "fieldType": propertyFieldType,
            "groupName": propertyGroupName,
            "formField": true
    
        };
        try {
            await axios.post(contactCreatePropertyURL, body, {
                params: {
                    hapikey:this.HAPIKEY
                }
            })
        } catch (e) {
            console.error("==== WAS NOT ABLE TO POST NEW PROPERTY ===");
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
                    hapikey: this.HAPIKEY,
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