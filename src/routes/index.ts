import { Router } from 'express'
const axios = require("axios");
const http = require("http");
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.HAPIKEY || !process.env.SAPIKEY || !process.env.STENANTALIAS) {
    throw new Error('Missing HAPIKEY environment variable.')
}

const HAPIKEY = process.env.HAPIKEY;
const SAPIKEY = process.env.SAPIKEY;
const STENANTALIAS = process.env.STENANTALIAS;

const router = Router()
router.get('/api/', (_, res) => {
	res.setHeader('content-type', 'application/json')
	res.end(JSON.stringify({
		apiVersion: 1,
		documentation: 'https://github.com/SENG499-team-2/SaaSquatch-HubSpot-integration'
	}))
})




const getContacts = async () => {
    try {
        console.log('=== attempting to get all hubpsot conacts api key is ===' + HAPIKEY);
        const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
        const response = await axios.get(allContacts);
        const data = response.data;
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }
	

}

router.get('/contacts', async (req, res) => {

    const contact = await getContacts();
    res.json(contact);
    console.log('got contacts');
    res.end();
});

const getParticipants = async () => {
    try {
        console.log('=== attempting to get all SaaSquatch participants api key is ===' + SAPIKEY);
        const allParticipants = 'https://staging.referralsaasquatch.com/api/v1/' +STENANTALIAS+ '/users';
        console.log(allParticipants);
        const response = await axios.get(allParticipants, { headers: { 'User-Agent': SAPIKEY }  } );
        console.log(response);
        const data = response.data;
        console.log(data);
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve participants');
        console.log(e);
        return JSON.parse(e);
    }
	

}

router.get('/participants', async (req, res) => {

    const Participants = await getParticipants();
    console.log('res:' + res)
    res.json(Participants);
    console.log('got Participants');
    res.end();
});
export default router
