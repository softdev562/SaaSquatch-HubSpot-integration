import { loadFeature, defineFeature } from 'jest-cucumber';

const MatchUsersAndContacts = loadFeature('features/MatchUsersContacts.feature');

//This is just a toy example for demonstration.
defineFeature(MatchUsersAndContacts, test => {
    let emailSaasquatch: string, emailHubspot: string;

    function update(a: string, b: string) {
        if (a == b) {
            return true;
        } else {
            return false;
        }
    };

    test('Matching email address', ({given, when, then, and}) => {
        given('A user with the email address adamh@gmail.com', () => {
            emailSaasquatch = 'adamh@gmail.com';
        });

        and('There is a contact with the email address adamh@gmail.com in Hubspot', () => {
            emailHubspot = 'adamh@gmail.com';
        });

        when('User\'s are synced from SaaSquatch to Contacts in Hubspot', () => {
            //sync()
        });

        then('adamh@gmail.com is updated, not created in Hubspot', () => {
            expect(update(emailSaasquatch,emailHubspot)).toBe(true);
        });
    });
});