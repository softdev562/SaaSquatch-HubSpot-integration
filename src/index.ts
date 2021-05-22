import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'express'

// constants
dotenv.config({path: __dirname+'/index.env'});
const port = process.env.PORT;
const hapikey = process.env.HAPIKEY;

// initialize application
const app = express();
const hs = 'hubspot';
const sq = 'saasquatch';

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.status(200).send('Hello world!')
})

// /hubspot/contacts?limit=n&archived=b
// n is the maximum number of contacts.
// b indicates whether to include archived contacts
app.get(`/${hs}/contacts`, (req, res) => {
	axios({
		method: 'get',
		url: `https://api.hubapi.com/crm/v3/objects/contacts?limit=${req.query.limit}&archived=${req.query.archived}&hapikey=${hapikey}`
	}).then(axiosRes => {
		res.send(axiosRes.data);
	}).catch(err => {
		res.send(err);
	});
});

// /hubspot/addcontact
// Adds a contact to the hubspot account.
app.post(`/${hs}/addcontact`, (req, res) => {
	axios({
		method: 'post',
		url:`https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hapikey}`,
		data: req.body
	}).then(axiosRes =>{
		res.send(axiosRes.data);	
	}).catch(err => {
		res.send(err);
	});
});

app.listen(port, () => console.log(`running express application on localhost:${port}`))
