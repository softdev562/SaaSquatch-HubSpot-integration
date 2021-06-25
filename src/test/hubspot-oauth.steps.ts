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
	const configurationPageURL = 'http://localhost:3000/configuration';
	const homePage = 'http://localhost:3000/'

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
		}
	});

	test('User tries to access configuration page without being authenticated', ({ given, when, then }) => {
        given('The user is not authenticated', () => {
			// New window is unauthenticated
        });

        when('The user tries to navigate to the configuration page', () => {
			driver.get(configurationPageURL);
        });

        then('The user is redirected back to the login page', () => {
			driver.wait(until.urlIs(homePage), 2000);
			expect(driver.getCurrentUrl()).toBe(homePage);
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
