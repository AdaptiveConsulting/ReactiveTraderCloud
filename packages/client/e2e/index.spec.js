const {
	MouseButton,
	OpenFinHome,
	OpenFinNotifications,
	OpenFinProxy,
	OpenFinSystem,
	WebDriver,
	WebDriverKeys
} = require('@openfin/automation-helpers');
const { NativeDriver, NativeDriverKeys } = require('@openfin/automation-native');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');

let providerWindowUrl;

describe('Reactive Trader - openfin', () => {
	it('The runtime is ready', async () => {
		console.log('Tests Started', globalThis.automation.globalVars?.startTime);

		const isReady = await OpenFinSystem.waitForReady(10000);
		expect(isReady).to.equal(true);
	});

	it('The title should be set', async () => {
		const title = await WebDriver.getTitle();
		expect(title).to.equal('Adaptive Platform Provider');
	});

	it('The url should be set', async () => {
		providerWindowUrl = await WebDriver.getUrl();
		expect(providerWindowUrl).not.be.undefined;
	});

	it('The runtime version should be set', async () => {
		const fin = await OpenFinProxy.fin();
		const version = await fin.System.getVersion();
		expect(version).to.equal('29.108.73.14');
	});

	it('Can perform a conditional Node Webdriver specific test', async () => {
		if (globalThis.nodeWebDriver) {
			const elem = await globalThis.nodeWebDriver.findElement("css selector","[data-testid='menuButton-EUR']");
			expect(elem).to.exist;
		}
	});

});
