import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { spawn, ChildProcessWithoutNullStreams  } from 'child_process';
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome'
require('chromedriver'); // Selenium chrome webdriver
const waitOn = require('wait-on');

const HubspotOauth = loadFeature('features/Oauth/High-Level/Hubspot-Oauth.feature', {
	tagFilter: 'not @manual'
});

defineFeature(HubspotOauth, test => {
	// Selenium driver
	let driver: WebDriver;

	beforeEach(() => {
		// Build new selenium driver
		driver = new Builder()
		.forBrowser('chrome')
		.build();
	});

	afterEach(() => {
		try {
			//driver.quit();
		} catch(e) {
			console.log(e)
		}
	});

    test('User completes Hubspot oauth flow correctly', ({ given, when, and, then }) => {
        given('The user has a Hubspot account', () => {

        });

        when('The user starts the Hubspot oauth flow from the integration', () => {

        });

        and('The user correctly login to Hubspot', () => {

        });

        and('The user is redirected to the integration\'s callback page', () => {

        });

        then('The user should be redirected to the configuration page', () => {

        });

        and('The pop up window should close', () => {

        });
    });

	test('User tries to access configuration page without being authenticated', ({ given, when, then, and }) => {
        given('The user is not authenticated', () => {

        });

        when('The user tries to navigate to the configuration page', () => {

        });

        then('The user is redirected back to the login page', () => {

        });
    });

	test('The integration is able to obtain a new refresh token from Hubspot', ({ given, when, then, and }) => {
		given('The user has completed the integration\'s Hubspot oauth flow', () => {

        });

        when('The integration needs a new refresh token from Hubspot', () => {

        });

        then('A new refresh token should be returned from Hubspot', () => {

        });
	});

	test('The integration is not able to obtain a new refresh token from Hubspot', ({ given, when, then, and }) => {
        given('The user has completed the integration\'s Hubspot oauth flow before', () => {

        });

        and('The integration app is disconnected on the users Hubspot account', () => {

        });

        when('The integration needs a new refresh token from Hubspot', () => {

        });

        then('A new refresh token is not returned from Hubspot', () => {

        });

        and('A 401 error response is returned', () => {

        });
	});
});
