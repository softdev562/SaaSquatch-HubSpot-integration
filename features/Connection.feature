Feature: Connection

    Describes how a user can connect the SaaSquatch and
    Hubspot accounts using the integration.

    Background:
        Given I have a SaaSquatch account
        And a Hubspot account

    Scenario: Enabling the integration
        Given I am logged into my SaaSquatch account
        And I am in the integrations portion of the SaaSquatch app
        Then I can connect my SaaSquatch and Hubspot accounts under Integrations
        When I turn on the integration
        And login with Hubspot oauth
        Then the two systems can communicate
    
    Scenario: Disabling the integration
        Given I am logged into my SaaSquatch account
        And I am in the integrations portion of the SaaSquatch app
        When I disable the integration in my account
        Then then the integration should be disabled
        And should only be re-enabled when the user connects the integration again

    Scenario: Disconnecting Hubspot from integration 
    	When I disconnect the integration from my Hubspot account
    	Then the integration can no longer make any protected API calls to Hubspot 