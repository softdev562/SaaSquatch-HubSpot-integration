Feature: Hubspot oauth flow

	@manual
	Scenario: User completes Hubspot oauth flow correctly
		Given The user has a Hubspot account
		When The user starts the Hubspot oauth flow from the integration
		And The user correctly login to Hubspot
		And The user is redirected to the integration's callback page
		Then The user should be redirected to the configuration page
		And The pop up window should close

	@manual
	Scenario: User completes Hubspot oauth flow with errors
		Given The user starts the Hubspot oauth flow
		When The user <Oauth Error>
		Then The user <Outcome>
		And The user should not be redirected to the configuration page

	| Oauth Error                     | Outcome                                            |
	| Closes the popup window         | Should be shown error text                         |
	| Does not have a Hubspot account | Will not be redirected to Hubspot app install page |
	| Internal integration error      | Will not have the app installed                    |

	@manual
	Scenario: User tries to access configuration page without being authenticated
		Given The user is not authenticated
		When The user tries to navigate to the configuration page
		Then The user is redirected back to the login page

	Scenario: The integration is able to obtain a new refresh token from Hubspot
		Given The user has completed the integration's Hubspot oauth flow
		When The integration needs a new refresh token from Hubspot
		Then A new refresh token should be returned from Hubspot

	Scenario: The integration is not able to obtain a new refresh token from Hubspot
		Given The user has completed the integration's Hubspot oauth flow before
		And The integration app is disconnected on the users Hubspot account
		When The integration needs a new refresh token from Hubspot
		Then A new refresh token is not returned from Hubspot
		And A 401 error response is returned
