import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { getHubspotAccessToken } from '../../routes/oath';
require('dotenv').config();

const HubspotOauth = loadFeature('features/Oauth/High-Level/Hubspot-Oauth.feature', {
	tagFilter: 'not @manual'
});

defineFeature(HubspotOauth, test => {
	test('The integration is able to obtain a new refresh token from Hubspot', ({ given, when, then, and }) => {
		const connectedRefreshToken = process.env.HUBSPOT_REFRESH_TOKEN_CONNECTED; // TODO: remove and connect to firebase if we want to set test accounts
		let data: any;

		given('The user has completed the integration\'s Hubspot oauth flow', () => {});

        when('The integration needs a new refresh token from Hubspot', async () => {
			try {
				console.log(connectedRefreshToken)
				data = await getHubspotAccessToken(connectedRefreshToken);
			} catch (e) {
				console.log(e.message);
				expect(e).toBeUndefined();
			}
        });

        then('A new refresh token should be returned from Hubspot', () => {
			expect(data["refresh_token"]).toBe(connectedRefreshToken);
			expect(data["access_token"]).toBeDefined();
        });
	});

	test('The integration is not able to obtain a new refresh token from Hubspot', ({ given, when, then, and }) => {
		const disconnectedRefreshToken = process.env.HUBSPOT_REFRESH_TOKEN_DISCONNECTED;
		let data: Map<string, any>;
       
		given('The user has completed the integration\'s Hubspot oauth flow before', () => {});

        and('The integration app is disconnected on the users Hubspot account', () => {});

        when('The integration needs a new refresh token from Hubspot', async () => {
			try {
				data = await getHubspotAccessToken(disconnectedRefreshToken);
			} catch (e) {
				expect(e).toBeDefined();
			}
        });

        then('A new refresh token is not returned from Hubspot', () => {
			expect(data).toBeUndefined();
        });
	});
});
