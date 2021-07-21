import { Router } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

import { HubApiCall } from './oath';

//#todo: probably replace the line below with a DB import when the DB is ready
import { tokenStore } from './oath';

//ensures that API keys are accessible THIS Will be replaced by OATH
if (!process.env.HAPIKEY || !process.env.SAPIKEY || !process.env.STENANTALIAS) {
    throw new Error('Missing HAPIKEY environment variable.');
}

const HAPIKEY = process.env.HAPIKEY;
const SAPIKEY = process.env.SAPIKEY;
const STENANTALIAS = process.env.STENANTALIAS;

const router = Router();
router.get('/api/', (_, res) => {
    res.setHeader('content-type', 'application/json');
    res.end(
        JSON.stringify({
            apiVersion: 1,
            documentation: 'https://github.com/SENG499-team-2/SaaSquatch-HubSpot-integration',
        }),
    );
});

//checks the JSON identity item returned from hubspot is infact an email
// TODO
// - it would be nice to validate that the string is in email format
async function isHubspotEmail(identities: any) {
    try {
        if (identities['type'] === 'EMAIL') {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return e;
    }
}

//accepts a single hubspot contact JSON object, and tries to post them as new users in Saasquatch
//	TO DO
//	- use the graphQL api instead of REST
// 	- search saasquatch to see if the user exists yet
// 	- generate share links and codes for new participants
//	- establish standards for making 'id' and 'accountId' maybe using the hubspot ID with a specific tag so that imports can be reversed
//	- Parsing the JSON shouldn't rely on hardcoding the value locations
//	- Use Oauth to post instead of API key
async function postContacts(contact: any) {
    //console.log('EMAIL:' + contact['identity-profiles'][0]['identities'][0]['value']);
    const identities = contact['identity-profiles'][0]['identities'];
    if (identities) {
        if (isHubspotEmail(identities[0])) {
            //can be just dot mo [']
            const firstName = contact['properties']['firstname']['value'];
            const lastName = contact['properties']['lastname']['value'];
            const email = identities[0]['value'];
            //URL should be built using express URL class
            const postParticipant =
                'https://staging.referralsaasquatch.com/api/v1/' +
                STENANTALIAS +
                '/open/account/' +
                email +
                '/user/' +
                email;
            try {
                const response = await axios.post(
                    postParticipant,
                    {
                        id: firstName + lastName,
                        accountId: firstName + lastName,
                        firstName: firstName,
                        lastInitial: lastName[0],
                        email: email,
                        lastName: lastName,
                    },
                    {
                        headers: {
                            Authorization: 'token ' + SAPIKEY,
                        },
                    },
                );
                return response;
            } catch (e) {
                console.error(e);
            }
        }
    }
}

// queries the list of users for the account with the given API key and returns the list
// TO DO
//	- Add parameters for custom integrations as documented in the UI diagrams
// 	- Change this function to use pagination instead of getting the entire list
//	- move the postContacts funtion to its own route

const getContacts = async () => {
    //console.log('=== attempting to get all hubpsot conacts api key is ===' + HAPIKEY);
    const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
    try {
        const response = await axios.get(allContacts);
        const data = response.data;
        //isolates just the contacts portion of the response
        const hubspotContacts = data['contacts'] || [];
        if (hubspotContacts.length !== 0) {
            try {
                await hubspotContacts.forEach(postContacts);
            } catch (e) {
                console.error('  > Failed in posting contacts from HubSpot to SaaSquatch');
                console.error(e);
            }
        }
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve all contacts form HubSpot');
        console.error(e);
    }
};

router.get('/contacts', async (req, res) => {
    try {
        //#todo: Update line below to get refresh_token from db when its ready
        const contact = await HubApiCall(getContacts, tokenStore[req.sessionID]['refresh_token']); //await getContacts();
        res.json(contact);
        res.end();
    } catch (e) {
        console.error(e);
        res.redirect('/hubspot');
    }
});

router.post('/contacts', async (req, res) => {
    const contact = await getContacts();
    res.json(contact);
    res.end();
});

// add the participants in Saas to Hubspot contact list
async function addContacts(participant: any) {
    try {
        const addContact = 'https://api.hubapi.com/crm/v3/objects/contacts?hapikey=' + HAPIKEY;
        const response = await axios.post(addContact, {
            properties: {
                company: '',
                email: participant.email,
                firstname: participant.firstName,
                lastname: participant.lastName,
                phone: '',
                website: '',
            },
        });
        return response;
    } catch (e) {
        console.error('  > Unable to add new contact');
    }
}

//returns a list of Saasquatch participants for a given api key and tenet alias
const getParticipants = async () => {
    try {
        //console.log('=== attempting to get all SaaSquatch participants api key is ===' + SAPIKEY);
        const allParticipants = 'https://staging.referralsaasquatch.com/api/v1/' + STENANTALIAS + '/users';
        const response = await axios.get(allParticipants, {
            auth: {
                username: '',
                password: SAPIKEY,
            },
        });
        const data = response.data;
        if (data.count != 0) {
            //console.log('there are total ' + data.count + ' contacts');
            for (let i = 0; i < data.count; i++) {
                //console.log(data.users[i].id);
                addContacts(data.users[i]);
            }
        }
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve participants');
        console.error(e);
    }
};

router.get('/participants', async (req, res) => {
    try {
        const Participants = await getParticipants();
        res.json(Participants);
        res.end();
    } catch (e) {
        //  As per Muhammads request:
        //  user disconnects our integration and access
        //  token has expired so the API calls will return
        //  an error. In this scenario We must redirect user
        //  to authorize the application again. So in the catch
        //  we can have res.redirect("/hubspot"))
        console.error('  > Unable to retrieve participants');
        console.error(e);
    }
});

export default router;
