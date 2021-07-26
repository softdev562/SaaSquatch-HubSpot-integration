import axios from 'axios';
import { PollTokensFromDatabase } from '../database';
import { LookupAlias } from '../database';

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
    public async getContact(contactObjectID: number, hub_id: number, paramToGet?: string): Promise<any> {
        try {
            const tenantAlias: any = await LookupAlias(hub_id.toString());

            if (tenantAlias == '') {
                throw Error('Alias not found');
            }
            try {
                const token: any = await PollTokensFromDatabase(tenantAlias);
                const access_token = token.accessToken;
                const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactObjectID)}`;
                let options: any = {
                    qs: { properties: 'email', archived: 'false' },
                    headers: { accept: 'application/json', authorization: `Bearer ${access_token}` },
                };
                if (paramToGet) {
                    options = {
                        qs: { properties: 'email', archived: 'false' },
                        headers: { accept: 'application/json', authorization: `Bearer ${access_token}` },
                    };
                } else {
                    options = {
                        qs: { archived: 'false' },
                        headers: { accept: 'application/json', authorization: `Bearer ${access_token}` },
                    };
                }

                try {
                    const resp = await axios.get(url, options);
                    if (resp.status != 200) {
                        throw Error('Error getting a contact from HubSpot.' + resp.data['error']);
                    } else {
                        return resp.data;
                    }
                } catch (e) {
                    console.error(`Error getting a contact from HubSpot. ${e}`);
                }
            } catch (e) {
                console.error(`Error Fetching Tokens from DB when getting contact. ${e}`);
            }
        } catch (e) {
            console.error('Alias not found');
        }
    }

    /**
     * Creates an object in Hubspot
     *
     * @param objectType object type to be created. e.g. deals, contacts, company
     * @param createObjectBody body specifiying the create properties of the object
     * @returns axios response
     */
    public async createObject(objectType: string, createObjectBody: any, hub_id: number) {
        try {
            const tenantAlias: any = await LookupAlias(hub_id.toString());

            if (tenantAlias == '') {
                throw Error('Alias not found');
            }
            try {
                const token: any = await PollTokensFromDatabase(tenantAlias);
                const access_token = token.accessToken;
                try {
                    const createObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType;
                    const response = await axios.post(createObjectURL, createObjectBody, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${access_token}`,
                        },
                    });
                    return response;
                } catch (e) {
                    console.error(`Unable to create contact. ${e}`);
                    return JSON.parse(e.response.body);
                }
            } catch (e) {
                console.error(`Error Fetching Tokens from DB when creating object. ${e}`);
            }
        } catch (e) {
            console.error(`Alias not found when creating contact. ${e}`);
        }
    }

    /**
     *
     * @param objectType object to create property to check property for
     * @param propertyName the name of the property, not the label
     * @returns true if the property exists, otherwise false
     */
    public async objectHasProperty(objectType: string, propertyName: string, hub_id: number) {
        try {
            const tenantAlias: any = await LookupAlias(hub_id.toString());

            if (tenantAlias == '') {
                throw Error('Alias not found');
            }
            try {
                const token: any = await PollTokensFromDatabase(tenantAlias);
                const access_token = token.accessToken;
                const readPropertyURL = 'https://api.hubapi.com/crm/v3/properties/' + objectType + '/' + propertyName;

                try {
                    const response = await axios.get(readPropertyURL, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${access_token}`,
                        },
                    });
                    if (response.status == 200) {
                        return true;
                    } else {
                        console.error('======== WAS NOT ABLE TO READ PROPERTY ========');
                        console.error(response);
                    }
                } catch (e) {
                    if (e.response.status == 404) {
                        return false;
                    } else {
                        console.error(`Unable to get property. ${e}`);
                        return JSON.parse(e.response.body);
                    }
                }
            } catch (e) {
                console.error(`Error Fetching Tokens from DB when finding object property. ${e}`);
            }
        } catch (e) {
            console.error(`Alias not found when finding object property. ${e}`);
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
    public async createObjectProperty(
        objectType: string,
        propertyName: string,
        propertyLabel: string,
        propertyType: string,
        propertyFieldType: string,
        propertyGroupName: string,
        hub_id: number,
    ) {
        try {
            const tenantAlias: any = await LookupAlias(hub_id.toString());

            if (tenantAlias == '') {
                throw Error('Alias not found');
            }
            try {
                const token: any = await PollTokensFromDatabase(tenantAlias);
                const access_token = token.accessToken;
                const contactCreatePropertyURL = 'https://api.hubapi.com/crm/v3/properties/' + objectType;
                const body = {
                    name: propertyName,
                    label: propertyLabel,
                    type: propertyType,
                    fieldType: propertyFieldType,
                    groupName: propertyGroupName,
                    formField: true,
                };
                try {
                    await axios.post(contactCreatePropertyURL, body, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': JSON.stringify(body).length,
                            Authorization: `Bearer ${access_token}`,
                        },
                    });
                } catch (e) {
                    console.error(`Was not able to post to create property. ${e}`);
                    return JSON.parse(e.response.body);
                }
            } catch (e) {
                console.error(`Error Fetching Tokens from DB when creating object property. ${e}`);
            }
        } catch (e) {
            console.error(`Alias not found when creating object property. ${e}`);
        }
    }

    /**
     *
     * @param objectType object to search for. e.g. deals, contacts, company
     * @param body body specifiying the search properties of the object
     * @returns axios response
     */
    public async searchObject(objectType: string, body: any, hub_id: number) {
        try {
            const tenantAlias: any = await LookupAlias(hub_id.toString());

            if (tenantAlias == '') {
                throw Error('Alias not found');
            }

            try {
                const token: any = await PollTokensFromDatabase(tenantAlias);

                const access_token = token.accessToken;
                try {
                    const searchObjectURL = 'https://api.hubapi.com/crm/v3/objects/' + objectType + '/search';

                    const response = await axios.post(searchObjectURL, body, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': JSON.stringify(body).length,
                            Authorization: `Bearer ${access_token}`,
                        },
                    });

                    return response;
                } catch (e) {
                    console.error(`Unable to post for search object. ${e}`);
                    return JSON.parse(e.response.body);
                }
            } catch (e) {
                console.error(`Error Fetching Tokens from DB when searching for object. ${e}`);
            }
        } catch (e) {
            console.error(`Alias not found when searching for object. ${e}`);
        }
    }
}
