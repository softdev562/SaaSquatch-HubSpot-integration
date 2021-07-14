Feature: Front end configuration settings are saved between sessions

    As a user, when I go to edit my configuration, I want the configuration from my last session to be visible


    Scenario: User Sets up New Configuration
        Given a user logs in to the configuration page, and they have not previously set up a configuration
        When I add configuration settings and hit sync
        Then my configuration is saved in the database

    Scenario: User returns to Visible Existing Configuration
        Given a user logs in to the configuration page, and they have previously set up a configuration
        When I open the configuration screen
        Then My previous configuration settings are visible

    Scenario: User returns and Existing Configuration is saved in the database
        Given a user logs in to the configuration page, and they have previously set up a configuration
        When I change configuration settings and hit sync
        Then my configuration is updated saved in the database


