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

describe('Register with Home', () => {
	it('The runtime is ready', async () => {
		console.log('Tests Started', globalThis.automation.globalVars?.startTime);

		const isReady = await OpenFinSystem.waitForReady(10000);
		expect(isReady).to.equal(true);
	});

	it('Can switch to platform window', async () => {
		const switched = await WebDriver.switchToWindow('identityString', [
			'register-with-home',
			'register-with-home'
		]);
		expect(switched).to.equal(true);
	});

	it('The title should be set', async () => {
		const title = await WebDriver.getTitle();
		expect(title).to.equal('Platform Provider');
	});

	it('The url should be set', async () => {
		providerWindowUrl = await WebDriver.getUrl();
		expect(providerWindowUrl).not.be.undefined;
	});

	it('The runtime version should be set', async () => {
		const fin = await OpenFinProxy.fin();
		const version = await fin.System.getVersion();
		expect(version).to.equal('31.112.75.4');
	});

	it('The identity should be set', async () => {
		const fin = await OpenFinProxy.fin();
		expect(fin.me.identity.name).to.equal('register-with-home');
		expect(fin.me.identity.uuid).to.equal('register-with-home');
	});

	it('Can get a list of windows', async () => {
		const windows = await WebDriver.getWindows();
		expect(windows.length).to.greaterThan(0);
	});

	it('Can launch notification center in a security realm', async () => {
		const launched = await OpenFinNotifications.launch();
		expect(launched).to.equal(true);

		if (launched) {
			await OpenFinNotifications.toggle();
		}
	});

	it('Can open the home window', async () => {
		const isShown = await OpenFinHome.show(30000);
		expect(isShown).to.equal(true);

		await WebDriver.saveScreenshot();
		await OpenFinNotifications.toggle();
	});

	it('Can perform a conditional Node Webdriver specific test', async () => {
		if (globalThis.nodeWebDriver) {
			const elem = await globalThis.nodeWebDriver.findElement('xpath', "//*[@id='search-input']");
			expect(elem).to.exist;
		}
	});

	it('Can perform a conditional Selenium Webdriver specific test', async () => {
		if (globalThis.seleniumWebDriver) {
			const elem = await globalThis.seleniumWebDriver.findElement(By.xpath("//*[@id='search-input']"));
			expect(elem).to.exist;
		}
	});

	it('Can perform an actions test with keys and mouse', async () => {
		const elem = await WebDriver.findElementByPath("//*[@id='search-input']");
		expect(elem).to.exist;

		await WebDriver.actions([
			// Enter some text
			{ type: 'keyPress', key: 'tt' },
			{ type: 'pause', duration: 1000 },
			// Correct mistake
			{ type: 'keyPress', key: WebDriverKeys.Backspace },
			{ type: 'keyPress', key: 'h' },
			{ type: 'keyPress', key: 'i' },
			{ type: 'keyPress', key: 's' },
			{ type: 'pause', duration: 1000 },
			// Move to start of input
			{ type: 'mouseMove', origin: elem, x: 100 },
			{ type: 'mouseDown', button: MouseButton.Left },
			// Drag highlight the content
			{ type: 'mouseMove', origin: elem, x: 0 },
			{ type: 'mouseUp', button: MouseButton.Left },
			{ type: 'pause', duration: 1000 },
			// Delete the content
			{ type: 'keyPress', key: WebDriverKeys.Delete },
			{ type: 'pause', duration: 1000 }
		]);

		const content = await elem.getAttribute('value');
		expect(content).to.equal('');
	});

	it('Can set/get/remove a property of an element', async () => {
		await OpenFinHome.show(10000);

		const elem = await WebDriver.findElementByPath("//*[@id='search-input']");
		expect(elem).to.exist;

		await elem.setProperty('data-prop', 'foo');
		const prop = await elem.getProperty('data-prop');
		expect(prop).to.equal('foo');
		await elem.removeProperty('data-prop');
		const prop2 = await elem.getProperty('data-prop');
		expect(prop2).to.equal(undefined);
	});

	it('Can set/get/remove an attribute of an element', async () => {
		const elem = await WebDriver.findElementByPath("//*[@id='search-input']");
		expect(elem).to.exist;

		await elem.setAttribute('disabled', 'true');
		const attr = await elem.getAttribute('disabled');
		expect(attr).to.equal('true');
		await elem.removeAttribute('disabled');
		const attr2 = await elem.getAttribute('disabled');
		expect(attr2).to.equal(null);
	});

	it('Can set/get/remove the style of an element', async () => {
		const elem = await WebDriver.findElementByPath("//*[@id='search-input']");
		expect(elem).to.exist;

		const style = await elem.getStyle();
		expect(style.fontSize).to.equal('20px');

		await elem.setStyle({
			fontSize: '50px'
		});

		const style2 = await elem.getStyle();
		expect(style2.fontSize).to.equal('50px');

		await elem.removeStyle(['fontSize']);

		const style3 = await elem.getStyle();
		expect(style3.fontSize).to.equal('20px');
	});

	it('Can search in the home window', async () => {
		await OpenFinHome.search('interop');
		await WebDriver.sleep(1000);

		const ids = await OpenFinHome.searchResultIds();

		expect(ids.length).equal(3);
		expect(ids[0]).equal('interop-broadcast-view');
		expect(ids[1]).equal('interop-intent-view');
		expect(ids[2]).equal('winform-interop-example');

		await WebDriver.saveScreenshot();
	});

	it('Can select entries in the home window by index', async () => {
		await WebDriver.sleep(1000);
		await OpenFinHome.searchResultByIndex(1, 'select');

		await WebDriver.sleep(1000);
		await OpenFinHome.searchResultByIndex(0, 'select');
	});

	it('Can select entries in the home window by id', async () => {
		await WebDriver.sleep(1000);
		await OpenFinHome.searchResultById('interop-intent-view', 'select');

		await WebDriver.sleep(1000);
		await OpenFinHome.searchResultById('interop-broadcast-view', 'select');
	});

	it('Can open the home window filters', async () => {
		await OpenFinHome.filtersOpen();
	});

	it('Can get the filter ids', async () => {
		const filterIds = await OpenFinHome.filtersIds();
		expect(filterIds.length).equal(9);
		expect(filterIds[0]).equal('appasset');
		expect(filterIds[1]).equal('developer');
		expect(filterIds[2]).equal('dock');
		expect(filterIds[3]).equal('intent');
		expect(filterIds[4]).equal('interop');
		expect(filterIds[5]).equal('native');
		expect(filterIds[6]).equal('openfin');
		expect(filterIds[7]).equal('tools');
		expect(filterIds[8]).equal('view');
	});

	it('Set a filter by index', async () => {
		const state = await OpenFinHome.filtersByIndexGet(4);
		expect(state).equal(false);

		await OpenFinHome.filtersByIndexSet(4, true);
		const state2 = await OpenFinHome.filtersByIndexGet(4);
		expect(state2).equal(true);
	});

	it('Set a filter by id', async () => {
		const state = await OpenFinHome.filtersByIdGet('view');
		expect(state).equal(false);

		await OpenFinHome.filtersByIdSet('view', true);
		const state2 = await OpenFinHome.filtersByIdGet('view');
		expect(state2).equal(true);
	});

	it('Can close the home window filters', async () => {
		await WebDriver.sleep(3000);
		await OpenFinHome.filtersClose(true);
		await WebDriver.sleep(2000);
	});

	it('Can check selected entry content', async () => {
		const itemHtml = await OpenFinHome.searchResultSelectedItem();
		expect(itemHtml).contains('Intents using Interop API');

		const itemDescriptionHtml = await OpenFinHome.searchResultSelectedDetails();
		expect(itemDescriptionHtml).contains(
			'This is an example of firing and listening to intents using the interop api and seeing a code sample of how to do it.'
		);
	});

	it('Can open an entry in the home window', async () => {
		await WebDriver.sleep(500);
		await OpenFinHome.searchResultById('interop-intent-view', 'open');
		await WebDriver.sleep(500);
	});

	it('Can clear entries in the home window', async () => {
		await OpenFinHome.searchClear();
		await WebDriver.sleep(500);
		await OpenFinHome.searchClear();

		await WebDriver.sleep(1000);
		await OpenFinHome.hide();
	});

	it('Can close the home window', async () => {
		await WebDriver.sleep(500);
		await OpenFinHome.hide();
	});

	it('Can perform operation in the interop window', async () => {
		await WebDriver.switchToWindow('title', 'Interop Intents - Intents using Interop');

		const elem = await WebDriver.findElementByPath('//h1');
		await elem.setHTML('My New Title');

		const elem2 = await WebDriver.findElementByPath('//h1');
		const value = await elem2.getHTML();
		expect(value).eq('My New Title');

		await WebDriver.sleep(2000);
	});

	it('Can select a context menu entry in the interop window', async () => {
		const foundWin = await WebDriver.switchToWindow('identityString', [
			/internal-generated-window*/,
			/register-with-home/
		]);
		expect(foundWin).to.be.true;

		if (foundWin) {
			const elem = await WebDriver.findElementByPath("//*[@aria-label='Open Browser Menu']");
			expect(elem).to.exist;

			if (elem) {
				// First click on the button to show the native context menu
				await WebDriver.actions([
					{ type: 'mouseMove', origin: elem },
					// Open the context menu
					{ type: 'mouseClick', button: MouseButton.Left },
					// Pause to give the menu time to appear
					{ type: 'pause', duration: 2000 }
				]);

				// Do down arrow * 5 to select the close, you should see the confirmation popup
				await NativeDriver.actions([
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'keyPress', key: NativeDriverKeys.Down },
					{ type: 'pause', duration: 1000 },
					{ type: 'keyPress', key: NativeDriverKeys.Enter },
					// Pause to see the confirmation
					{ type: 'pause', duration: 2000 }
				]);
			}
		}
	});

	it('Can exit the runtime', async () => {
		const found = await WebDriver.switchToWindow('url', providerWindowUrl);
		expect(found).to.equal(true);
		const fin = await OpenFinProxy.fin();
		await fin.System.exit();
	});
});
