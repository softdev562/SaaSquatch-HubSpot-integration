Feature: Hubspot-to-SaaSquatch

    As a marketer I want to be able to send emails to
    contacts in Hubspot, and have those include share links

    Scenario: Contacts get share links
    When a Contact is created in Hubspot
    But they don't exist in SaaSquatch
    Then they are created in SaaSquatch
    And generated a share link
    And that link shows up in Hubspot
    