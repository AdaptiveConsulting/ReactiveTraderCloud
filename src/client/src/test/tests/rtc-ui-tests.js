const { getConfig } = require('../config');

describe('Reactive Trader Cloud tests:', function() {
  describe('UI tests', function() {
    this.slow(30000);
    before(function(client, done) {
      done();
    });

    after('After the test actions', function(client, done) {
      client.end(function() {
        done();
      });
    });

    afterEach(function(client, done) {
      done();
    });

    beforeEach(function(client, done) {
      done();
    });

    it('Load RTC page and check the title', function(client) {
      client
        .url(getConfig().host)
        .expect.element('body')
        .to.be.present.before(1000);
      client.pause(5000).assert.title('Reactive Trader Cloud');
    });

    it('Check the number of tiles displayed is 9', function(client) {
      client.elements('css selector', '.workspace-region__item', function(
        result
      ) {
        client.assert.equal(result.value.length, 9);
      });
    });

    it('Check the Profit & Loss tile is displayed', function(client) {
      client.expect
        .element('.analytics__header-title')
        .text.to.equal('Profit & Loss');
      client.expect
        .element('.analytics__chart-title')
        .text.to.equal('Positions');
    });

    it('Check the grid table is displaying the correct headers', function(client) {
      client.elements(
        'css selector',
        '.ReactVirtualized__Table__headerTruncatedText',
        valNumberOfElements(client, gridHeaderTitles)
      );
    });

    it('Click and trade on a side to perform a trade', function(client) {
      client
        .click('.spot-tile__price--bid')
        .expect.element('.trade-notification__summary-item--notional')
        .to.be.visible.after(2000);
    });

    it('Enter a new notional by clicking into the text box', function(client) {
      client
        .clearValue('.notional__size-input')
        .setValue('.notional__size-input', '10000')
        .click('.spot-tile__price--bid')
        .assert.visible('.trade-notification__summary-item--notional');
    });

    it('Hovering on the spot tile should reveal the spot date', function(client) {
      client.moveToElement('.spot-tile__delivery', 10, 10, async function() {
        client.getText('.spot-tile__tenor', function(sp) {
          client.assert.equal(sp.value, 'SP');
          // Missing here a JS validation on the hover - SP date is shown
        });
      });
    });

    it('GBP/JPY is ALWAYS rejected', function(client) {
      client
        .url(getConfig().host)
        .waitForElementPresent('body')
        .waitForElementNotPresent('.spot-tile__notification-message', 10000)
        .useXpath()
        .click(
          '//*[@id="root"]/div/div[2]/div[1]/div[1]/div/div/div[3]/div/div/div[2]/div[1]/div[3]/span/span[2]' // GBP/JPY sell button
        )
        .useCss()
        .waitForElementPresent('.trade-notification__trade-status', 20000)
        .useXpath()
        .waitForElementPresent(
          '//div[@id="borderLayout_eGridPanel"]/div/div/div[4]/div[3]/div/div/div/div[3]'
        )
        .getText(
          '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[3]',
          function(result) {
            client.assert.equal(result.value, 'Rejected');
          }
        );
    });

    it(' EUR/JPY ALWAYS times out and then the execution succeeds- The time out should be reflected by a message on the tile When it succeeds, the trade should appear in the blotter', function(client) {
      client
        .url(getConfig().host)
        .waitForElementPresent('body')
        .useCss()
        .waitForElementNotPresent('.spot-tile__notification-message', 10000)
        .useXpath()
        .waitForElementPresent(
          '//*[@id="root"]/div/div[2]/div[1]/div[1]/div/div/div[6]/div/div/div[2]/div[1]/div[3]/span/span[2]', // EUR/JPY Buy button
          20000
        )
        .click(
          '//*[@id="root"]/div/div[2]/div[1]/div[1]/div/div/div[6]/div/div/div[2]/div[1]/div[3]/span/span[2]' // EUR/JPY Buy button
        )
        .useCss()
        .waitForElementPresent('.spot-tile__notification-message', 10000)
        .getText('.spot-tile__notification-message', function(result) {
          client.assert.equal(result.value, 'Trade execution timeout exceeded');
        })
        .waitForElementPresent(
          '.trade-notification__summary-item--notional',
          5000
        )
        .getText('.trade-notification__summary-item--notional', function(
          result
        ) {
          client.assert.equal(result.value, 'EUR 1,000,000');
        })
        .waitForElementNotPresent(
          '.trade-notification__summary-item--notional',
          5000
        )
        .useXpath()
        .getText(
          '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[6]', // To of the grid
          function(result) {
            client.assert.equal(result.value, 'EURJPY');
          }
        )
        .getText(
          '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[3]',
          function(result) {
            client.assert.equal(result.value, 'Done');
          }
        );
    });
  });
});

const gridHeaderTitles = [
  'ID',
  'DATE',
  'DIRECTION',
  'CCYCCY',
  'NOTIONAL',
  'RATE',
  'STATUS',
  'VALUE DATE',
  'TRADER'
];
function valNumberOfElements(client, elemVals) {
  return function iter(elems) {
    let i = 0;
    elems.value.forEach(function(element) {
      client.elementIdText(element.ELEMENT, function(result) {
        client.assert.equal(result.value, elemVals[i]);
        i++;
      });
    });
  };
}
