import {defineFeature, loadFeature} from "jest-cucumber";
import {HubApiCall} from "../routes/oath";
const axios = require("axios");
const Disconnect = loadFeature('features/Disconnect.feature');
const querystring = require('query-string');
axios.defaults.adapter = require('axios/lib/adapters/http')
const correctCall = async () => {
    try {
        // this represents any api call that doesn't fail
       const response = await axios.get('https://dog.ceo/api/breeds/list/all')
        const data = response.data;
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

const errorCall = async () => {
    try {
        var options = {
            method: 'GET',
            url: 'https://api.hubapi.com/crm/v3/objects/contacts',
            qs: {limit: '10', archived: 'false'},
            headers: {accept: 'application/json', authorization: 'expired_refresh_token'}
        };

        const response = await axios.get(querystring.stringify(options));
        const data = response.data;
        return data;

    } catch (e) {
        console.log('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

defineFeature(Disconnect, test => {
    //#todo UPDATE LINE BELOW TO RECIEVE access and refresh token from DB
    let refresh_token: string, access_token: string;

    test('Disconnecting Hubspot from integration', ({given, and, when, then}) => {

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
            //
            access_token = "nowexpiredaccess_token";
        });

        then('requests from the integration to protected endpoints in Hubspot fail', () => {
            // the api call will happen in the final then
        });

        and('the integration attempts to get a new access token from Hubspot', () => {
            // this step is done in step a call to hubspotAPi function in the then below
        });

        then('a bad request error is returned', async () => {
            const res = await HubApiCall(errorCall,refresh_token);
            try {
                expect(res.statusText).toBe('Bad Request');
            }
            catch(e)
            {
                expect(true).toBe(false)
            }
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
                const res = await HubApiCall(correctCall,refresh_token);

                expect(res.status).toBe('success');


        });


    });



});