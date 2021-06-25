Feature: Integration's access to Saasquatch tennant 

	@manual
	Scenario: The integration has access to the tennants data
		Given The integration is enabled on the tennant's integrations page
		When The integration tries to access the tennants data
		Then The integration should be able to abtain access to the tennants data

	@manual
	Scenario: The integration does not have access to the tennants data
		Given The integration is not enabled on the tennant's integrations page
		When The integration tries to access the tennants data
		Then The integration should not be able to abtain access to the tennants data

	@manual
	Scenario: The integration recieves webhooks
		Given The integration is enabled on the tennant's integrations page
		And A webhook is made to send a request to the integration
		When A webhook is posted to the integration
		Then The integration recieves the webhook and proccess it correctly

	@manual
	Scenario: The integration does not recieves webhooks
		Given The integration is not enabled on the tennant's integrations page
		And A webhook is made to send a request to the integration
		When A webhook is posted to the integration
		Then The integration does not recieve a webhook
