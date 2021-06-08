Feature: Generate Share Links For Hubspot Contacts

    As a marketer I want to be able to send emails to
    contacts in Hubspot, and have those include share links

    Background:
        Given the integration is active

    Scenario: Contacts get share links
        When a Contact is created in Hubspot
        But they don't exist in SaaSquatch
        Then they are created in SaaSquatch
        And generated a share link
        And that link shows up in Hubspot
    