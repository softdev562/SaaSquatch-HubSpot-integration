Feature: Saasquatch oauth flow

	Scenario: The integration is able to obtain a new JWT from Saasquatch
		Given The integration is enabled on the users inteagtion's page
		When The integration needs a new JWT from Saasquatch
		Then A new JWT should be returned from Saasquatch

	# TODO:
	# Can this be done automatically, needs the user to disconnect the app from there account manually.
	# Or can be done once we have Firebse DB and have a test account so we have the refresh token but is permenantly disconnected.
	Scenario: The integration is not able to obtain a new JWT from Saasquatch
		Given The integration is not enabled on the users inteagtion's page
		And The integration is disconnected on the users account
		When The integration needs a new refrsh token from Hubspot
		Then A new refrsh token is not returned from Hubspot
		And A 401 error response is returned