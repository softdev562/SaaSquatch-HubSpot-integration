import "mocha";
import {ApiCall} from "../src/routes/oath";
//import {refresh_token} from "../src/routes/oath";
const chai = require( 'chai')
var assert = chai.assert;
const axios = require("axios");

const HAPIKEY = process.env.HAPIKEY;

const getContacts = async () => {
    try {
      //  const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
        const response = await axios.get('https://dog.ceo/api/breeds/list/all')
        //const response = await axios.get(allContacts);
        const data = response.data;
        return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

const errorCall = async () => {
    try {
          const allContacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + HAPIKEY;
          const response = await axios.get(allContacts);
          const data = response.data;
          return data;
    } catch (e) {
        console.error('  > Unable to retrieve contact');
        return JSON.parse(e.response.body);
    }

}

it(' If the API call returns no errrors then getHubspotAccessfunc is not called ',async function()
{
    const res = await ApiCall(getContacts,"wrongtoken");
    assert(res.status == 'success');
})


it(' If the api call returns an error and an invalid refresh token is passed then "BAD_REFRESH_TOKEN" error is returned  ',async function()
{
    const res = await ApiCall(errorCall,"wrongtoken");

    assert(res.response.data.status, 'BAD_REFRESH_TOKEN');

})
