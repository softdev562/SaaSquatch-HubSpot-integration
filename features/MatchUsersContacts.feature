Feature: Match Users To Contacts

    Matches Users in SaaSquatch to Contacts in Hubspot.

    Scenario: Matching email address
        Given a user with the email address adamh@gmail.com
        And there is a contact with the email address adamh@gmail.com in Hubspot
        When User's are synced from SaaSquatch to Contacts in Hubspot
        Then adamh@gmail.com is updated, not created in Hubspot
