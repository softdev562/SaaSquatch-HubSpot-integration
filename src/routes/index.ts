import { Router } from 'express'
import axios from 'axios'
import http from 'http'
import chalk from 'chalk'
import * as dotenv from 'dotenv';
import { listenerCount } from 'events';
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

async function isHubspotEmail(identities: any){
	
	try {
		if (identities['type'] === 'EMAIL'){
			return true;
		}
		else{
			return false;
		}
	} catch (e) {
        console.error('  > Unable to retrieve contact');
        return e;
    }
}

//
async function postContacts(contact: any) {
	try {
		console.log('EMAIL:' + contact['identity-profiles'][0]['identities'][0]['value']);
		const identities = contact['identity-profiles'][0]['identities']
		if (identities){
			if (isHubspotEmail(identities[0])){
				//can be just dot mo [']
				const firstName = contact['properties']['firstname']['value'];
				const lastName = contact['properties']['lastname']['value']; 

				//should be built using express URL class
				const postParticipant = 'https://staging.referralsaasquatch.com/api/v1/' +STENANTALIAS+ '/open/account/' + firstName + lastName + '/user/' + firstName + lastName;
				//console.log(postParticipant);
				const email = identities[0]['value'];
				const response = await axios.post(postParticipant,{
				    
					
						id: firstName+lastName,
						accountId: firstName+lastName,
						firstName: firstName,
						lastInitial: lastName[0],
						email: email,
						lastName: lastName,
					
					},
					{
					  headers: {
				        'Authorization':'token '+SAPIKEY
				    }
					});
				
			}
		}

        return;
    } catch (e) {
        console.log(e);
        return e;
    }
	

}


const getContacts = async () => {
    try {
        console.log('=== attempting to get all hubpsot conacts api key is ===' + HAPIKEY);
        const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
        const response = await axios.get(allContacts);
        const data = response.data;
		//console.log(data);
		//isolates just the contacts portion of the response
		let hubspotContacts = data['contacts'] || [];
		//console.log(hubspotContacts);

		if(hubspotContacts.length !== 0){
			await hubspotContacts.forEach(postContacts);
		}
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

router.post('/contacts', async (req, res) => {

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
        const response = await axios.get(allParticipants, {
            auth: {
                username: '',
                password: SAPIKEY
            }
        });
        console.log('test' + response);
        const data = response.data;
        console.log(data);
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve participants');
        console.log(e);
        return e;
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
