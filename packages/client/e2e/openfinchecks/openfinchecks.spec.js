const {
    OpenFinSystem,
    WebDriver,
} = require('@openfin/automation-helpers');
const { expect } = require('chai');

let providerWindowUrl;

describe('Reactive Trader - openfin', () => {
    it('The runtime is ready', async () => {
        console.log('Tests Started', globalThis.automation.globalVars?.startTime);

        const isReady = await OpenFinSystem.waitForReady(10000);
        expect(isReady).to.equal(true);
    });

    it('The url should be set', async () => {
        providerWindowUrl = await WebDriver.getUrl();
        expect(providerWindowUrl).not.be.undefined;
    });
});
