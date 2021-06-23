import {defineFeature, loadFeature} from "jest-cucumber";
import {HubApiCall} from "../routes/oath";
const axios = require("axios");
const Disconnect = loadFeature('features/Disconnect.feature');
const querystring = require('query-string');
axios.defaults.adapter = require('axios/lib/adapters/http')
let refresh_token: string, access_token: string;

const apiCallThatReturnsSuccess = async () => {
    try {
        // this represents any api call that doesn't fail
        //#todo update this with an api call to HUBSPOT when we have test account access tokens availble in DB
       const response = await axios.get('https://dog.ceo/api/breeds/list/all')
        const data = response.data;
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

const apiCallWithExpiredAccessToken = async () => {
    try {

        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
            headers: {
            accept: 'application/json', authorization: "Bearer" + access_token
            }
        })

        const data = response.data;

        return data;

    } catch (e) {

        console.log('  > Unable to retrieve contact');

        return JSON.parse(e.response.body);
    }

}

defineFeature(Disconnect, test => {
    //#todo UPDATE LINE BELOW TO RECIEVE access and refresh token from DB

    test('Disconnecting Hubspot from integration',  ({given, and, when, then}) => {

        given('I have a SaaSquatch account', () => {

        });

        and('a Hubspot account', () => {

        });

        given('I have installed the integration in Hubspot', () => {
            // this can be verified by checking if the user has a refresh token.
        });

        when('I disconnect the integration from my Hubspot account', () => {
            // this implies that the refresh token has been invalidated
            // unable to get selenium working as of yet but for testing
            // purposes we can use an invalid refresh token (random string)
            refresh_token = 'invalid token example';
        });

        and('the current access token expires', () => {

            access_token = "nowexpiredaccess_token";
        });

        then('requests from the integration to protected endpoints in Hubspot fail', async () => {
            try {
                const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
                    headers: {
                        accept: 'application/json', authorization: "Bearer" + access_token
                    }
                })

            }
            catch(e)
            {
                expect(e.response.data.category).toBe('INVALID_AUTHENTICATION');

            }
        })

        and('the integration attempts to get a new access token from Hubspot',async () => {

            // this step is done in step a call to hubspotAPi function in the then below
        });

        then('a bad request error is returned', async () => {
            const res = await HubApiCall(apiCallWithExpiredAccessToken,refresh_token);

            expect(res.statusText).toBe('Bad Request');

        });

    });

    test('Disconnecting Hubspot from integration and access token is not expired yet', ({given, and, when, then}) => {

        given('I have a SaaSquatch account', () => {

        });

        and('a Hubspot account', () => {

        });

        given('I have installed the integration in Hubspot', () => {
            // this can be verified by checking if the user has a refresh token.
        });

        when('I disconnect the integration from my Hubspot account', () => {
            // this implies that the refresh token has been invalidated
            // unable to get selenium working as of yet but for testing
            // purposes we can use an invalid refresh token (random string)
            refresh_token = 'invalid token example';
        });

        and('the current access token has not expired', () => {
            //#todo perhaps consider getting the access token from DB
            //#todo although a mock api call that returns success is sufficient for this test
            access_token = "valid_access_token";
        });

        then('requests from the integration to protected endpoints in Hubspot pass', () => {
            // the api call will happen in the final then
        });

        and('a status 200 is returned',async () => {
                const res = await HubApiCall(apiCallThatReturnsSuccess,refresh_token);
                expect(res.status).toBe('success');
        });

    });

});