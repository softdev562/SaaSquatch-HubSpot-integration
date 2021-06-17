Feature: Sync Participants with HubSpot

    As a user, I want to be able to sync participants in SaaSquatch as contacts in HubSpot

    Background:
        Given the integration is active

    Scenario: Import existing participants in SaaSquatch as contacts in HubSpot
        Given a participant exists in SaaSquatch
        When I have toggled the import existing participants option on and selected the fields to sync
        Then a contact is created in HubSpot with those fields

    Scenario: Do not import existing participants in SaaSquatch as contacts in HubSpot
        Given a participant exists in SaaSquatch
        When I have toggled the import existing participants option off
        Then contacts are not created in HubSpot

    Scenario: Create contact in HubSpot when a participant is created in SaaSquatch
        Given a participant is created in SaaSquatch
        When I have toggled the create new contact option on and selected the fields to sync
        Then a new contact is created in HubSpot with those fields

    Scenario: Do not create contact in HubSpot when a participant is created in SaaSquatch
        Given a participant is created in SaaSquatch
        When I have toggled the create new contact option off
        Then a new contact is not created in HubSpot

    Scenario: Delete contact in HubSpot when the participant is deleted in SaaSquatch
        Given a participant is deleted in SaaSquatch
        When I have toggled the delete contact option on
        Then the contact is deleted in HubSpot

    Scenario: Do not delete contact in HubSpot when the participant is deleted in SaaSquatch
        Given a participant is deleted in SaaSquatch
        When I have toggled the delete contact option off
        Then the contact is not deleted in HubSpot

    Scenario: Import existing referral links to contact in HubSpot from participant in SaaSquatch
        Given a contact exists in HubSpot and the particpant exists in SaaSquatch
        When I have toggled the import existing referral links option on and selected what referral programs to sync
        Then the participant’s referral links are added to the contact in HubSpot from the selected referral programs

    Scenario: Do no import existing referral links to contact in HubSpot from participant in SaaSquatch
        Given a contact exists in HubSpot and the particpant exists in SaaSquatch
        When I have toggled the import existing referral links option off
        Then the participant’s referral links are not added to the contact in HubSpot

    Scenario: Add referral link to contact in HubSpot when new referral link is created for participant in SaaSquatch
        Given a contact exists in HubSpot and the participant exists in SaaSquatch
        When the user has toggled the add new referral link option on
        Then the participant's new referral link is added to the contact in HubSpot

    Scenario: Do not add referral link to contact in HubSpot when new referral link is created for participant in SaaSquatch
        Given a contact exists in HubSpot and the participant exists in SaaSquatch
        When the user has toggled the add new referral link option off
        Then the participant's new referral link is not added to the contact in HubSpot
