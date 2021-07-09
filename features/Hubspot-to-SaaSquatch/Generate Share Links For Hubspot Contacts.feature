Feature: Generate Share Links For Hubspot Contacts

    As a marketer I want to be able to send emails to
    contacts in Hubspot, and have those include share links

    Background:
        Given the integration is active

    
    Scenario: New HubSpot Contacts that already exist in SaaSquatch get share links
        When A Contact is created in Hubspot
        And they exist in SaaSquatch
        Then their share link shows up back in Hubspot
    
    Scenario: New HubSpot Contacts that do not yet exist in SaaSquatch get share links
        When A Contact is created in Hubspot
        But they don't exist in SaaSquatch
        Then they are created in SaaSquatch
        And their generated share link shows up back in Hubspot