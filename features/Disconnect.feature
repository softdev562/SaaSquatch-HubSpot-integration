
Feature: Disconnect
  Background:
    Given I have a SaaSquatch account
    And a Hubspot account

    Scenario: Disconnecting Hubspot from integration
    Given I have installed the integration in Hubspot
    When I disconnect the integration from my Hubspot account
    And  the current access token expires
    Then requests from the integration to protected endpoints in Hubspot fail
    And the integration attempts to get a new access token from Hubspot
    Then a bad request error is returned

    Scenario: Disconnecting Hubspot from integration and access token is not expired yet
    Given I have installed the integration in Hubspot
    When I disconnect the integration from my Hubspot account
    And  the current access token has not expired
    Then requests from the integration to protected endpoints in Hubspot pass
    And a status 200 is returned
