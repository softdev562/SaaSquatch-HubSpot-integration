Feature: Sync Contacts with SaaSquatch

    As a user, I want to be able to sync contacts in HubSpot as participants in SaaSquatch

    Background:
        Given the integration is connected

    Scenario: Create new participant in SaaSquatch when a contact is created in HubSpot
        Given a contact is created in HubSpot
        When I have toggled the create new participants option on
        Then a matching participant is created in SaaSquatch with the same First Name, Last Name, Email, and a new generated Sharelink

    Scenario: Do not create new participant in SaaSquatch when a contact is created in HubSpot
        Given a contact is created in HubSpot
        When I have toggled the create new particpants option off
        Then a matching participant is not created in SaaSquatch with the same First Name, Last Name, Email, and a new generated Sharelink

    Scenario: Import existing contacts in HubSpot as participants in SaaSquatch
        Given a contact exists in HubSpot
        When I have toggled the import existing contacts as participants option on
        Then a matching participant is created in SaaSquatch with the same First Name, Last Name, Email, and a new generated Sharelink

    Scenario: Do not import existing contacts in HubSpot as participants in SaaSquatch
        Given a contact exists in HubSpot
        When I have toggled the import existing contacts as participants option off
        Then a matching participants is not created in SaaSquatch with the same First Name, Last Name, Email, and a new generated Sharelink
