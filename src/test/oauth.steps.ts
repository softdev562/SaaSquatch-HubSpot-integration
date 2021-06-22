import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { spawn, ChildProcessWithoutNullStreams  } from 'child_process';
import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome'
require('chromedriver'); // Selenium chrome webdriver
const waitOn = require('wait-on');

const HubspotOauth = loadFeature('features/Oauth/Hubspot\ Oauth.feature');

defineFeature(HubspotOauth, test => {
	// Integration server process
    let integration: ChildProcessWithoutNullStreams;

	// Selenium driver
	let driver: WebDriver;

	beforeAll(async () => {
		jest.setTimeout(30000)
		// Start integration and wait for it to start.
		integration = spawn('npm', ['run', 'watch']);
		await waitOn({
			resources: ['http://localhost:3000/']
		});
	});

	beforeEach(() => {
		// Stop Hubspot from detecting chrome is being controlled when signing in.
		const options = new Options();
		options.addArguments("--disable-blink-features=AutomationControlled");//.addArguments("--headless");

		// Build new selenium driver
		driver = new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build();
	});

	afterAll(() => {
		// Make sure to end the driver and the integration
		try {
			//driver.quit();
		} catch(e) {
			console.error(e)
		}
		try {
			integration.kill("SIGINT");
		} catch(e) {
			console.error(e)
		}
	});

	/**
	 * Scenario: User completes Hubspot oauth flow correctly
	 *  Given The user has a Hubspot account
	 *  When The user starts the Hubspot oauth flow from the integration
	 *  And The user correctly signs into Hubspot
	 *  And The user is redirected to the integration's callback page
	 *  Then The integration should have access to the user's account data
	 *  And The user should be redirected to the configuration page
	 *  And The pop up window should close
	 * 
	 */
    test('User completes Hubspot oauth flow correctly', ({given, when, then, and}) => {
        given('The user has a Hubspot account', () => {
        });

        when('The user starts the Hubspot oauth flow from the integration', async () => {
			const buttonXPath: string = '//*[@id="root"]/div/div/div/div/button';
            try {
				await driver.get('http://localhost:3000/');
				await driver.findElement(By.xpath(buttonXPath)).click();
			} finally {
				expect(driver.getAllWindowHandles)
			}
        });

		and('The user correctly signs into Hubspot', () => {

		});

		and('The user is redirected to the integration\'s callback page', () => {

		});

		then('The integration should have access to the user\'s account data', () => {

		});

		and('The user should be redirected to the configuration page', () => {

		});

		and('The pop up window should close', () => {

		});
    });
});
