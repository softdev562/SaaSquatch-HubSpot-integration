Feature: Connection

    Describes how a user can connect the SaaSquatch and
    Hubspot accounts using the integration.

    Background:
        Given I have a SaaSquatch account
        And a Hubspot account

    Scenario: Enabling the integration
        When I log into SaaSquatch
        Then I can connect my SaaSquatch and Hubspot accounts under Integrations
        When I turn on the integration
        And login with Hubspot oauth
        Then the two systems can communicate
    
    Scenario: Disconnecting the integration
        When I disconnect from the integration
        Then then the integration should be disabled
        And should only be re-enabled when the user connects the integration again

    Scenario: Disconnecting Hubspot from integration 
    	When I disconnect the integration from my Hubspot account
    	Then the integration can no longer make any protected API calls to Hubspot 