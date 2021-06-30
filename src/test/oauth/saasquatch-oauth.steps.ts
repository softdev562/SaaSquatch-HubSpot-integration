import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { getSaasquatchToken } from '../../routes/oath';

const SaasquatchOauthDetails = loadFeature('features/Oauth/Low-Level/Saasquatch-Oauth-Details.feature', {
	tagFilter: 'not @manual'
});

defineFeature(SaasquatchOauthDetails, test => {

	test('Integration requests auth0 JWT from Saasquatch correctly', ({given, when, then, and}) => {
		let data: any;

		given('The integration is not enabled on the tennant\'s integrations page', () => {
			// Done manually
        });

        and('The integration needs a new JWT from Saasquatch', () => {});

        when('The integration sends a post request to Saasquatch\'s auth0 sever', async () => {
			try {
				data = await getSaasquatchToken();
			} catch (e) {
				expect(e).toBeUndefined();
			}
		});

        and('Includes a \'grant_type\' parameter that has a value of \'client_credentials\'', () => {});

        and('Includes a \'client_id\' parameter that has a value of the integration\'s client ID', () => {});

        and('Includes a \'client_secret\' parameter that has a value of the integration\'s client secret', () => {});

        and('Includes a \'audience\' parameter that has a value of \'https://staging.referralsaasquatch.com\'', () => {});

        then('A new JWT should be included in the response', () => {
			expect(data["access_token"]).toBeDefined();
		});
	});

	test('Integration requests auth0 JWT from Saasquatch incorrectly', ({ given, and, when, but, then }) => {
        given('The integration is not enabled on the tennant\'s integrations page', () => {

        });

        and('The integration needs a new JWT from Saasquatch', () => {

        });

        when('The integration sends a post request to Saasquatch\'s auth0 sever', () => {

        });

        and('Includes a \'grant_type\' parameter that has a value of \'client_credentials\'', () => {

        });

        and('Includes a \'client_id\' parameter that has a value of the integration\'s client ID', () => {

        });

        and('Includes a \'client_secret\' parameter that has a value of the integration\'s client secret', () => {

        });

        and('Includes a \'audience\' parameter that has a value of \'https://staging.referralsaasquatch.com\'', () => {

        });

        but('One or many of the parameters are missing or misspelled', () => {

        });

        then('An error response should be returned', () => {

        });
    });
});
