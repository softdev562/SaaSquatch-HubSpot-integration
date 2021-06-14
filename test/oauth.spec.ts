import "mocha";
import {ApiCall} from "../src/routes/oath";
//import {refresh_token} from "../src/routes/oath";
const chai = require( 'chai')
var assert = chai.assert;
const axios = require("axios");

const HAPIKEY = process.env.HAPIKEY;

const correctCall = async () => {
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
    const res = await ApiCall(correctCall,"wrongtoken");
    assert(res.status == 'success');

})


it(' If the api call returns an error and an invalid refresh token is passed then "BAD_REFRESH_TOKEN" error is returned  ',async function()
{
    const res = await ApiCall(errorCall,"wrongtoken");

    assert(res.response.status == 400);

    assert(res.response.data.status =='BAD_REFRESH_TOKEN');


})


it(' If the api call returns an error and a valid refresh token is passed then the API call is repeated',async function()
{
    // this can be tested once we have the refresh token stored in db

    // const res = await ApiCall(errorCall,"correct_token");
    // assert(res.status == 'success');

})
