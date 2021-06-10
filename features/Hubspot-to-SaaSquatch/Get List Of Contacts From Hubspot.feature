Feature: Get List Of Contacts From Hubspot

    As a developer, I want to get a list of contacts from a hubspot account in a json format


    Scenario: List of contacts
        When A Contact or multiple contacts exist in a Hubspot account
        Then I want to retrieve a list of all contacts
        And all the information associated with a contact in a json format