# SaaSquatch-HubSpot-integration
A project created by volunteer software engineering students at the University of Victoria, in collaboration with SaaSquatch, for importing data from HubSpot into SaaSquatch. This project was created for the course Software Engineering 499 (Design Project II) at the University of Victoria.

## Initial Setup
To setup your development environment:

1. Clone the repository: `git clone https://github.com/SENG499-team-2/SaaSquatch-HubSpot-integration.git`
2. Install dependencies: `cd SaaSquatch-HubSpot-integration && npm i && cd frontend && yarn install`
3. Launch the project: `cd .. && npm run watch`
4. View the launched project in your browser at `http://localhost:3000`

The backend can be viewed at `http://localhost:8000`. The port `8000` can be changed with the `PORT` environment variable.

## Environment Variables
The API requires environment variables PORT and HAPIKEY.
You can specify them in the terminal:

e.g. `PORT=8000 HAPIKEY= ... npm run watch`

or alternatively create a `.env` file with the following:

```
PORT=3000
HAPIKEY=...
SAPIKEY=...
STENANTALIAS=...

// Hubspot App Properties
HUBSPOT_CLIENT_ID=...
HUBSPOT_CLIENT_SECRET=...
HUBSPOT_REDIRECT_URI=...
HUBSPOT_WEBHOOK_URI=...

// Saasquatch Integration Properties
SAASQUATCH_CLIENT_ID=...
SAASQUATCH_CLIENT_SECRET=...
SAASQUATCH_JWKS_URI='https://staging.referralsaasquatch.com/.well-known/jwks.json'
```

## Setup the Integration with a HubSpot Dev Account
To use this Integration app with a HubSpot app:

1. Create an app in a HubSpot dev account. More information on how to do this can be found in HubSpot's dev docs: https://developers.hubspot.com/docs/api/working-with-oauth.
2. Get your client ID and client secret and save them in your `.env` file.
3. Set your redirect_uri in the HubSpot app. For running the app locally, this is `http:localhost:8000/oauth-callback`. Add this to your `.env` file.