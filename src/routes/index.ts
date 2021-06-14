import { Router } from 'express'
const axios = require("axios");
import * as dotenv from 'dotenv';
dotenv.config();
import {ApiCall} from "./oath";

if (!process.env.HAPIKEY) {
    throw new Error('Missing HAPIKEY environment variable.')
}
const HAPIKEY = process.env.HAPIKEY;

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

    try
    {
        const contact = await ApiCall(getContacts,"string");//await getContacts();
        res.json(contact);
        console.log('got contacts');
        res.end();

    }
    catch(e)
    {
        res.redirect("/hubspot");
    }
});
export default router
