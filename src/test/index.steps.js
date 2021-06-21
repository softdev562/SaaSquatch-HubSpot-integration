"use strict";
exports.__esModule = true;
var jest_cucumber_1 = require("jest-cucumber");
var MatchUsersAndContacts = jest_cucumber_1.loadFeature('features/MatchUsersContacts.feature');
//This is just a toy example for demonstration.
jest_cucumber_1.defineFeature(MatchUsersAndContacts, function (test) {
    var emailSaasquatch, emailHubspot;
    function update(a, b) {
        if (a == b) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    test('Matching email address', function (_a) {
        var given = _a.given, when = _a.when, then = _a.then, and = _a.and;
        given('A user with the email address adamh@gmail.com', function () {
            emailSaasquatch = 'adamh@gmail.com';
        });
        and('There is a contact with the email address adamh@gmail.com in Hubspot', function () {
            emailHubspot = 'adamh@gmail.com';
        });
        when('User\'s are synced from SaaSquatch to Contacts in Hubspot', function () {
            //sync()
        });
        then('adamh@gmail.com is updated, not created in Hubspot', function () {
            expect(update(emailSaasquatch, emailHubspot)).toBe(true);
        });
    });
});
