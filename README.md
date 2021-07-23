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
SERVER_TOKEN_SECRET=2c175eff51d2c03d2e1afac045ce026013f04a2e472cd08440b07307e99a6932cf81346513c5acec43899ef577e582aab8feceb0fd7a76b2bc49f0fa0df1c194

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
3. Set your redirect_uri in the HubSpot app. For running the app locally, this is `http://localhost:8000/oauth-callback`. Add this to your `.env` file.

## Tests with jest-cucumber
A sample test has been prepared in both the root directory and the frontend directory. `jest-cucumber` works by building test cases around `.feature` files.
Here are some files of interest:

* `jest.config.json` contains configurations for jest
* `package.json` contains scripts for running jest tests
* `/src/test` and `/frontend/src/test` contain test files with the extension `.steps.ts`
* `/features/MatchUsersContacts.feature` and `/frontend/features/MatchUsersContacts.feature` is used in the sample test file `index.steps.ts`

To run the tests use the command `yarn test`. The command will:

1. Compile the `.steps.ts` tests into `.steps.js`
2. Run the tests using `jest-cucumber`
3. Remove the `.steps.js` files

There are three other scripts: `build-tests` for building the test files, `run-tests` for executing the tests, and `clean-tests` for removing the `.steps.js` test files. `test` performs all three of these steps together.

## Running the frontend
Due to penpal, our frontend will only render a loading state outside of SaaSqautch's context.
There are 2 ways to see the frontend:
1. Go to the SaaSqautch integrations page and look at it im the iframe. If you want your branch specifically to run, go to our heroku app (https://dashboard.heroku.com/apps/team2-saasquatch/deploy/github) and scroll to manual deploy, where you can deploy your branch. It will take about 7 minutes to deploy, but you will then be able to see your branch in the iframe
2. If you want specifically to test out something in localhost, you'll have to butcher the penpal code a bit. In `Index.tsx`, comment out the `PenpalContextProvider`. Then search for `usePenpal`, and comment every instance of it, as well as anything in those files that refers to the `penpal` variable whose assignment you just commented. Then, in `ConfigurationP1.tsx` and `ConfigurationP2.tsx` find the line assigning the `emptyConfig` variable, and replace the `saasquatchTenantAlias` value with whatever tenant alias you'd like. I know it's not the prettiest solution, but it should work on localhost
