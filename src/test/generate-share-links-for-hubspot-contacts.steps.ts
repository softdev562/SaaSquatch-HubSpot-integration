import { loadFeature, defineFeature } from 'jest-cucumber';
import { HubspotPayload, SubscriptionType } from '../Types/types';
import { validateHubSpotWebhook } from '../routes/webhooks';
import hubspotSchema from '../Types/hubspot-payload-schema.json';
import Ajv from "ajv";

const ShareLinkForHubspotContacts = loadFeature('features/Hubspot-to-SaaSquatch/Generate Share Links For Hubspot Contacts.feature');


defineFeature(ShareLinkForHubspotContacts, test => {
    const validWebhookRequestBody: any = [
        {
          "objectId": 1246965,
          "propertyName": "lifecyclestage",
          "propertyValue": "subscriber",
          "changeSource": "ACADEMY",
          "eventId": 3816279340,
          "subscriptionId": 25,
          "portalId": 33,
          "appId": 1160452,
          "occurredAt": 1462216307945,
          "subscriptionType":"contact.propertyChange",
          "attemptNumber": 0
        },
        {
          "objectId": 1246978,
          "changeSource": "IMPORT",
          "eventId": 3816279480,
          "subscriptionId": 22,
          "portalId": 33,
          "appId": 1160452,
          "occurredAt": 1462216307945,
          "subscriptionType": "contact.creation",
          "attemptNumber": 0
        }
    ];

    const testFakeClientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const webhookSigVersion = 'v1';
    const crypto = require("crypto");
    const webhookSig = crypto.createHash('sha256').update(testFakeClientSecret + validWebhookRequestBody).digest('hex');

    const invalidWebhookRequestBody: any = [
        {
          "objectId": 1246978,
          "changeSource": "IMPORT",
          "eventId": 3816279480,
          "subscriptionId": 22,
          "portalId": 33,
          "appId": 1160452,
          "occurredAt": "contact.creation",
          "subscriptionType": 0,
          "attemptNumber": null
        }
    ];

    const invalidWebhookSig = crypto.createHash('sha256').update(JSON.stringify(validWebhookRequestBody)).digest('hex');

    // JSON schema validator
    const ajv: any = new Ajv();
    const hubSchema: Object = hubspotSchema;
    ajv.addSchema(hubSchema, "hubspot");

    const validateHubspotSchema = ajv.getSchema("hubspot");



    test('New HubSpot Contacts that do not yet exist in SaaSquatch get share links', ({given, when, but, then, and}) => {
        given('The integration is active', () => {
            // This is assumed for now, as system config in db is not yet set up
        });
        when('A Contact is created in Hubspot', () => {
            // validate well-formatted webhook from HubSpot
            expect(validateHubSpotWebhook(webhookSigVersion, webhookSig, validWebhookRequestBody)).toBe(true);
            expect(validateHubspotSchema(validWebhookRequestBody)).toBe(true);
            expect(validWebhookRequestBody[1].subscriptionType).toBe(SubscriptionType.ContactCreation);

            // confirm invalid webhook from not HubSpot (fake webhook)
            expect(validateHubSpotWebhook(webhookSigVersion, invalidWebhookSig, validWebhookRequestBody)).toBe(false);
            // confirm JSON Schema validation fails on malformed webhook JSON 
            expect(validateHubspotSchema(invalidWebhookRequestBody)).toBe(false);            

        });
        but('they don\'t exist in SaaSquatch', () => {
            //api call to get saasquatch users
            //match on email
        });
        then('they are created in SaaSquatch', () => {
            //api call to create saasquatch user with data from hubspot
        });
        and('their generated share link shows up back in Hubspot', () => {
            //api call at add share link to hubspot user
        });
    });

   
    test('New HubSpot Contacts that already exist in SaaSquatch get share links', ({given, when, and, then}) => {
        given('The integration is active', () => {
            // This is assumed for now, as system config in db is not yet set up
        });
        when('A Contact is created in Hubspot', () => {
            // validate webhook from HubSpot
            
        });
        and('they exist in SaaSquatch', () => {
            //api call to get saasquatch users
            //match on email
        });
        then('their share link shows up back in Hubspot', () => {
            //api call at add share link to hubspot user
        });
        
    });




});