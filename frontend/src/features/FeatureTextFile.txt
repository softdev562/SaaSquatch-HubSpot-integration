Feature: Front end configuration settings are saved between sessions

    As a user, when I go to edit my configuration, I want the configuration from my last session to be visible

    Scenario: User sets up new configuration
        Given a user logs in to the configuration page, and they have not previously set up a configuration
        When I add configuration settings and hit sync
        Then my configuration is saved in the database

    Scenario: User returns to visible existing configuration
        Given a user logs in to the configuration page, and they have previously set up a configuration
        When I open the configuration screen
        Then my previous configuration settings are visible

    Scenario: User returns and existing configuration is saved in the database
        Given a user logs in to the configuration page, and they have previously set up a configuration
        When I change configuration settings and hit sync
        Then my new configuration is updated and saved in the database
