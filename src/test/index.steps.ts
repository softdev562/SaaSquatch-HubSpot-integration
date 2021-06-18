import { loadFeature, defineFeature } from 'jest-cucumber';
import {HubApiCall} from "../routes/oath";
const connection = loadFeature('features/Disconnect.feature');
const axios = require("axios");
//
// const MatchUsersAndContacts = loadFeature('features/MatchUsersContacts.feature');
//
// //This is just a toy example for demonstration.
// defineFeature(MatchUsersAndContacts, test => {
//     let emailSaasquatch: string, emailHubspot: string;
//
//     function update(a: string, b: string) {
//         if (a == b) {
//             return true;
//         } else {
//             return false;
//         }
//     };
//
//     test('Matching email address', ({given, when, then, and}) => {
//         given('A user with the email address adamh@gmail.com', () => {
//             emailSaasquatch = 'adamh@gmail.com';
//         });
//
//         and('There is a contact with the email address adamh@gmail.com in Hubspot', () => {
//             emailHubspot = 'adamh@gmail.com';
//         });
//
//         when('User\'s are synced from SaaSquatch to Contacts in Hubspot', () => {
//             //sync()
//         });
//
//         then('adamh@gmail.com is updated, not created in Hubspot', () => {
//             expect(update(emailSaasquatch,emailHubspot)).toBe(true);
//         });
//     });
// });

const errorCall = async () => {
    try {
        //#todo update this api url below to have access token
        var options = {
            method: 'GET',
            url: 'https://api.hubapi.com/crm/v3/objects/contacts',
            qs: {limit: '10', archived: 'false'},
            headers: {accept: 'application/json', authorization: 'expired_access_token'}
        };

        const response = await axios.get(options);
        const data = response.data;
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

defineFeature(connection, test => {
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

        and('I have Hubspot access and refresh tokens stored', () => {
            //#todo UPDATE LINE BELOW TO RECIEVE access and refresh token from DB
            refresh_token = "refreshtokenfromDB";
            access_token = "accesstokenfromDB";
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
            expect(res.statusText).toBe('Bad Request');
        });

    });
});