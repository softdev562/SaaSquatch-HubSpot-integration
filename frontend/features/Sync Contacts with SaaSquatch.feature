Feature: Sync Contacts with SaaSquatch

    As a user, I want to be able to sync contacts in HubSpot as participants in SaaSquatch

    Background:
        Given the integration is active

    Scenario: Import existing contacts in HubSpot as participants in SaaSquatch
        Given a contact exists in HubSpot
        When I have toggled the import existing contacts option on and selected the fields to sync
        Then a participant is created in SaaSquatch with those fields

    Scenario: Do not import existing contacts in HubSpot as participants in SaaSquatch
        Given a contact exists in HubSpot
        When I have toggled the import existing contacts option off
        Then participants are not created in SaaSquatch

    Scenario: Create new participant in SaaSquatch when a contact is created in HubSpot
        Given a contact is created in HubSpot
        When I have toggled the create new participant option on and selected the fields to sync
        Then a new participant is created in SaaSquatch with those fields

    Scenario: Do not create new participant in SaaSquatch when a contact is created in HubSpot
        Given a contact is created in HubSpot
        When I have toggled the create new particpant option off
        Then a new participant is not created in SaaSquatch

    Scenario: Delete particpant in SaaSquatch when the contact is deleted in HubSpot
        Given a contact is deleted in HubSpot
        When I have toggled the delete participant option on
        Then the participant is deleted in SaaSquatch

    Scenario: Do not delete participant in SaaSquatch when the contact is deleted in HubSpot
        Given a contact is deleted in HubSpot
        When I have toggled the delete participant option off
        Then the participant is not deleted in SaaSquatch
