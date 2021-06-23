Feature: Saasquatch auth0

	Scenario: Integration requests auth0 JWT from Saasquatch correctly
		Given The integration is enabled on the tennant's integrations page
		And The integation's Saasquatch API JWT is expired
		And The integration uses the getSassquatchToken function
		When The integration sends a post request to Saasquatch's auth0 sever
		And Includes a 'grant_type' parameter that has a value of 'client_credentials'
		And Includes a 'client_id' parameter that has a value of the integration's client ID
		And Includes a 'client_secret' parameter that has a value of the integration's client secret
		And Includes a 'audience' parameter that has a value of 'https://staging.referralsaasquatch.com'
		Then The API JWT should be included in the response

	Scenario: Integration requests auth0 JWT from Saasquatch incorrectly
		Given The integration is enabled on the tennant's integrations page
		And The integation's Saasquatch API JWT is expired
		And The integration uses the getSassquatchToken function
		When The integration sends a post request to Saasquatch's auth0 sever
		And Includes a 'grant_type' parameter that has a value of 'client_credentials'
		And Includes a 'client_id' parameter that has a value of the integration's client ID
		And Includes a 'client_secret' parameter that has a value of the integration's client secret
		And Includes a 'audience' parameter that has a value of 'https://staging.referralsaasquatch.com'
		But One or many of the parameters are missing or misspelled
		Then The Saasquatch auth0 server should respond with a 401 error.

	Scenario: Integration requests auth0 JWT from Saasquatch without being enabled
		Given The integration is not enabled on the tennant's integrations page
		And The integation's Saasquatch API JWT is expired
		And The integration uses the getSassquatchToken function
		When The integration sends a post request to Saasquatch's auth0 sever
		And Includes a 'grant_type' parameter that has a value of 'client_credentials'
		And Includes a 'client_id' parameter that has a value of the integration's client ID
		And Includes a 'client_secret' parameter that has a value of the integration's client secret
		And Includes a 'audience' parameter that has a value of 'https://staging.referralsaasquatch.com'
		Then The Saasquatch auth0 server should respond with a 401 error.