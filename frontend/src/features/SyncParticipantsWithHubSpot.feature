Feature: Sync Participants with HubSpot

    As a user, I want to be able to sync participants in SaaSquatch as contacts in HubSpot

    Background:
        Given the integration is connected

    Scenario: Create contact in HubSpot when a participant is created in SaaSquatch
        Given a participant is created in SaaSquatch
        When I have toggled the create new contacts option on
        Then a matching contact is created in HubSpot with the same Name, Email, Sharelink, and Referrals

    Scenario: Do not create contact in HubSpot when a participant is created in SaaSquatch
        Given a participant is created in SaaSquatch
        When I have toggled the create new contacts option off
        Then a matching contact is not created in HubSpot with the same Name, Email, Sharelink, and Referrals

    Scenario: Import existing participants in SaaSquatch as contacts in HubSpot
        Given a participant exists in SaaSquatch
        When I have toggled the import existing participants as contacts option on
        Then a matching contact is created in HubSpot with the same Name, Email, Sharelink, and Referrals

    Scenario: Do not import existing participants in SaaSquatch as contacts in HubSpot
        Given a participant exists in SaaSquatch
        When I have toggled the import existing participants as contacts option off
        Then a matching contact is not created in HubSpot with the same Name, Email, Sharelink, and Referrals
