// import router from './index'
// import axios from 'axios'
// import http from 'http'
// import chalk from 'chalk'

// const HAPIKEY = process.env.HAPIKEY || '';
// const SAPIKEY = process.env.SAPIKEY || '';
// const STENANTALIAS = process.env.STENANTALIAS || '';

// const getContacts = async () => {
//     try {
//         console.log('=== attempting to get all hubpsot conacts api key is ===' + HAPIKEY);
//         const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
        
//         const response = await axios.get(allContacts);
//         //console.log(data);
//         const data = response.data;
//         var contacts = JSON.parse(data);
//         console.log(data);
//         for (var contact in data.contacts) {
//             console.log(contact);
//             console.log('test');
//         }
//         console.log(data);
//         return data;
//     } catch (e) {
//         console.error('  > Unable to retrieve contact');
//         return JSON.parse(e.response.body);
//     }
	

// }

// router.get('/contacts', async (req, res) => {

//     const contact = await getContacts();
//     res.json(contact);
//     console.log(res);
//     console.log('got contacts');
//     res.end();
// });

// const getParticipants = async () => {
//     try {
//         console.log('=== attempting to get all SaaSquatch participants api key is ===' + SAPIKEY);
//         const allParticipants = 'https://staging.referralsaasquatch.com/api/v1/' +STENANTALIAS+ '/users';
//         console.log(allParticipants);
//         const response = await axios.get(allParticipants, {
//             auth: {
//                 username: '',
//                 password: SAPIKEY
//             }
//         });
//         console.log(response);
//         const data = response.data;
//         console.log(data);
//         return data;
//     } catch (e) {
//         console.error('  > Unable to retrieve participants');
//         console.log(e);
//         return JSON.parse(e);
//     }
	

// }

// router.get('/participants', async (req, res) => {

//     const Participants = await getParticipants();
//     console.log('res:' + res)
//     res.json(Participants);
//     console.log('got Participants');
//     res.end();
// });

// export default router