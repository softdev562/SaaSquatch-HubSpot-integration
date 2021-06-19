Feature: Hubspot oauth flow

	Scenario: User completes Hubspot oauth flow correctly
		Given The user has a Hubspot account
		When The user starts the Hubspot oauth flow from the integration
		And The user correctly signs into Hubspot
		And The user is redirected to the integration's callback page
		Then The integration should have access to the user's account data
		And The user should be redirected to the configuration page
		And The pop up window should close

	# 	# TODO:
	# 	# Is this a front end test?
	# Scenario: User completes Hubspot oauth flow with errors


	Scenario: The user is able to obtain a new refresh token from Hubspot
		Given The user has completed the integration's Hubspot oauth flow
		When The user needs a new refrsh token from Hubspot
		Then A new refrsh token should be returned from Hubspot

	# TODO:
	# Can this be done automatically, needs the user to disconnect the app from there account manually.
	# Or can be done once we have Firebse DB and have a test account so we have the refresh token but is permenantly disconnected.
	Scenario: The user is not able to obtain a new refresh token from Hubspot
		Given The user has completed the integration's Hubspot oauth flow
		And The integration is disconnected on the users account
		When The user needs a new refrsh token from Hubspot
		Then A new refrsh token is not returned from Hubspot
		And A 401 error response is returned
