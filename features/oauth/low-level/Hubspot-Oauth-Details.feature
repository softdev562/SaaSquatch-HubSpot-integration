Feature: Hubspot low level actions

	@manual
	Scenario: Hubspot app and integration have different client ID
		Given The integration will try to install a Hubspot app that exists
		But The integration does not have the correct Client ID
		When The user starts the Hubspot oauth flow
		And The integration opens the the pop-up window with a url that contains the client ID
		Then The pop-up should display a connection error
		And A 404 error should be returned in the pop-up window

	@manual
	Scenario: Hubspot app and integration have different redirect uri
		Given The integration will try to install a Hubspot app that exists
		But The integration does not have the correct redirect uri
		When The user starts the Hubspot oauth flow
		And The integration opens the the pop-up window with a url that contains the redirect uri
		And The user is able to login to Hubspot
		Then The pop-up should display a connection error
		And A 400 error should be returned in the pop-up window

	@manual
	Scenario: Hubspot app and inteagration have different client secret
		Given The integration will try to install a Hubspot app that exists
		And The integration does not have the correct client secret
		When The user starts the Hubspot oauth flow
		And The user tries to connect the app
		Then The pop-up should close
		And The User is shown with error text
		And The integration is not installed on the users account
		And A 400 error should be returned to the integration

	@manual
	Scenario: Requesting refresh token and access token from Hubspot
		Given The user has completed the Hubspot oauth flow
		And The user was redirected to to the redirect uri
		And The url contains a code from Hubspot
		When The integration sends a post request to Hubspot
		And Includes a 'grant_type' parameter that has a value of 'authorization_code'
		And Includes a 'client_id' parameter that has the value of the Hubspot app client id
		And Includes a 'client_secret' parameter that has the value of the Hubspot app client secret
		And Includes a 'redirect_uri' parameter that has the value of the Hubspot app redirect uri
		And Includes a 'code' parameter that has the value of the code provided in the request from Hubspot
		Then An access token and refresh token should be apart of the response from Hubspot to access the accounts data
		And The user is redirected to the configuration page

	Scenario: Requesting a new access token from Hubspot
		Given The integration needs a new refresh token from Hubspot
		When The integration sends a post request to Hubspot
		And Includes a 'grant_type' parameter that has a value of 'refresh_token'
		And Includes a 'client_id' parameter that has the value of the Hubspot app client id
		And Includes a 'client_secret' parameter that has the value of the Hubspot app client secret
		And Includes a 'refresh_token' parameter that has the value of the refresh token
		Then The original refresh token and a new access token are returned

	Scenario: Requesting a new access token from Hubspot with errors
		Given The integration needs a new refresh token from Hubspot
		When The integration sends a post request to Hubspot
		And Includes a 'grant_type' parameter that has a value of 'refresh_token'
		And Includes a 'client_id' parameter that has the value of the Hubspot app client id
		And Includes a 'client_secret' parameter that has the value of the Hubspot app client secret
		And Includes a 'refresh_token' parameter that has the value of the refresh token
		But One or many of the parameters are missing or misspelled
		Then An error resposne is returned
		