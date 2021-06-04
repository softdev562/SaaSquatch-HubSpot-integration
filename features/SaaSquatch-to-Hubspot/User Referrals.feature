Feature: User Referrals

    As a sales person I want to see if someone is referred when
    I’m updating their record in Hubspot so that I can respond
    accordingly.

    Scenario: Syncing contacts and users
        Given a contact exists in Hubspot
        And a matching User exists in SaaSquatch
        When the user is referred
        Then the referral information is shown in Hubspot
        