const { getConfig } = require('../config');
const validate = require('../utils/validation');
module.exports = {
  '@tags': ['smoke', 'web'],

  before: function(browser) {
    browser
      .url(getConfig().host)
      .waitForElementPresent('body', 5000)
      .pause(5000);
  },
  after: function(browser) {
    browser.end();
  },

  // 'Load RTC page and check the title : ': function(browser) {
  //   browser.pause(5000).assert.title('Reactive Trader Cloud');
  // },
  // 'Check the number of tiles displayed is 9': function(browser) {
  //   browser
  //     .waitForElementPresent('.workspace-region__item', 5000)
  //     .elements('css selector', '.workspace-region__item', function(result) {
  //       browser.assert.equal(result.value.length, 9);
  //     });
  // },
  // 'Check the Profit & Loss tile is displayed': function(browser) {
  //   browser
  //     .waitForElementPresent('.analytics__header-title', 5000)
  //     .expect.element('.analytics__header-title')
  //     .text.to.equal('Profit & Loss');
  //   browser.expect
  //     .element('.analytics__chart-title')
  //     .text.to.equal('Positions');
  // },

  // 'Check the grid table is displaying the correct headers': function(browser) {
  //   const gridHeaderTitles = [
  //     'TRADE ID',
  //     'STATUS',
  //     'DATE',
  //     'DIRECTION',
  //     'CCYCCY',
  //     'NOTIONAL',
  //     'RATE',
  //     'VALUE DATE',
  //     'TRADER'
  //   ];
  //   browser
  //     .waitForElementPresent(
  //       'div.ag-cell-label-container.ag-header-cell-sorted-none > div.ag-header-cell-label > span.ag-header-cell-text',
  //       5000
  //     )
  //     .elements(
  //       'css selector',
  //       'div.ag-cell-label-container.ag-header-cell-sorted-none > div.ag-header-cell-label > span.ag-header-cell-text',
  //       validate.valNumberOfElements(browser, gridHeaderTitles)
  //     );
  // },

  // 'Hovering on the spot tile should reveal the spot date': function(browser) {
  //   browser
  //     .waitForElementPresent('.spot-tile__delivery', 5000)
  //     .moveToElement('.spot-tile__delivery', 10, 10)
  //     .assert.visible('.spot-tile__tenor')
  //     .assert.containsText('.spot-tile__tenor', 'SP');
  //   // Missing here a JS validation on the hover - SP date is shown
  // },

  // 'Click and trade on a side to perform a trade': function(browser) {
  //   browser
  //     .waitForElementPresent('.spot-tile__price--bid', 5000)
  //     .click('.spot-tile__price--bid')
  //     .waitForElementPresent(
  //       '.trade-notification__summary-item--notional',
  //       10000
  //     );
  // },

  // 'Enter a new notional by clicking into the text box': function(browser) {
  //   browser
  //     .waitForElementPresent('.notional__size-input', 5000)
  //     .clearValue('.notional__size-input')
  //     .setValue('.notional__size-input', '10000')
  //     .click('.spot-tile__price--bid')
  //     .assert.visible('.trade-notification__summary-item--notional');
  // },

  // 'GBP/JPY is ALWAYS rejected': function(browser) {
  //   browser
  //     .waitForElementNotPresent('.spot-tile__notification-message', 10000)
  //     .pause(10000)
  //     .useXpath()
  //     .waitForElementPresent(
  //       '//div[@id="root"]/div/div[2]/div/div/div/div/div[4]/div/div/div[2]/div/div/span/span[2]',
  //       5000
  //     )
  //     .click(
  //       '//div[@id="root"]/div/div[2]/div/div/div/div/div[4]/div/div/div[2]/div/div/span/span[2]' // GBP/JPY sell button
  //     )
  //     .useCss()
  //     .waitForElementPresent('span.trade-notification__trade-status', 5000)
  //     .useXpath()
  //     .waitForElementPresent(
  //       '//div[@id="borderLayout_eGridPanel"]/div/div/div[4]/div[3]/div/div/div/div[3]',
  //       20000
  //     )
  //     .getText(
  //       '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[3]',
  //       function(result) {
  //         browser.assert.equal(result.value, 'Rejected');
  //       }
  //     );
  // },

  // 'EUR/JPY ALWAYS times out and then the execution succeeds- The time out should be reflected by a message on the tile - When it succeeds, the trade should appear in the blotter': function(
  //   browser
  // ) {
  //   browser
  //     .pause(5000)
  //     .useCss()
  //     .waitForElementNotPresent('.spot-tile__notification-message', 10000)
  //     .useXpath()
  //     .waitForElementPresent(
  //       '//*[@id="root"]/div/div[2]/div[1]/div[1]/div/div/div[7]/div/div/div[2]/div[1]/div[3]/span/span[2]', // EUR/JPY Buy button
  //       20000
  //     )
  //     .click(
  //       '//*[@id="root"]/div/div[2]/div[1]/div[1]/div/div/div[7]/div/div/div[2]/div[1]/div[3]/span/span[2]' // EUR/JPY Buy button
  //     )
  //     .useCss()
  //     .waitForElementPresent('.spot-tile__notification-message', 5000)
  //     .getText('.spot-tile__notification-message', function(result) {
  //       browser.assert.equal(result.value, 'Trade execution timeout exceeded');
  //     })
  //     .waitForElementPresent(
  //       '.trade-notification__summary-item--notional',
  //       5000
  //     )
  //     .getText('.trade-notification__summary-item--notional', function(result) {
  //       browser.assert.equal(result.value, 'EUR 1,000,000');
  //     })
  //     .waitForElementNotPresent(
  //       '.trade-notification__summary-item--notional',
  //       5000
  //     )
  //     .useXpath()
  //     .getText(
  //       '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[6]', // To of the grid
  //       function(result) {
  //         browser.assert.equal(result.value, 'EURJPY');
  //       }
  //     )
  //     .getText(
  //       '//*[@id="borderLayout_eGridPanel"]/div[1]/div/div[4]/div[3]/div/div/div[1]/div[3]',
  //       function(result) {
  //         browser.assert.equal(result.value, 'Done');
  //       }
  //     );
  // },

  'On execution, a confirmation should appear showing a summary of the trade: Buy/Sell, Notional Currency and Amount, Rate, Spot Date, Trade ID': function(
    browser
  ) {
    browser
      .useXpath()
      .waitForElementPresent(
        '//div[@id="root"]/div/div[2]/div/div/div/div/div[5]/div/div/div[2]/div/div/span/span[2]',
        5000
      )
      .click(
        '//div[@id="root"]/div/div[2]/div/div/div/div/div[5]/div/div/div[2]/div/div/span/span[2]' // AUD/US Sell button
      )
      .useCss()
      .waitForElementPresent(
        'div.trade-notification__summary-item.trade-notification__summary-item--notional',
        5000
      )
      .assert.containsText(
        'div.trade-notification__summary-item.trade-notification__summary-item--notional',
        'AUD 1,000,000'
      )
      .assert.containsText(
        'div.trade-notification__details-item--label',
        'RATE'
      )
      .useXpath()
      .assert.containsText(
        '//div[@id="root"]/div/div[2]/div/div/div/div/div[5]/div/div/div[2]/div[4]/div[2]/div',
        'DATE'
      )
      .assert.containsText(
        '//div[@id="root"]/div/div[2]/div/div/div/div/div[5]/div/div/div[2]/div[4]/div[3]/div',
        'TRADE ID'
      );
  }
};
