var Application = require('spectron').Application;
var should = require('chai').should();
var spawn = require('child_process').spawn;

describe('application launch', function() {
  var app, browser;
  var timeout = 30000;
  this.slow(20000);
  this.timeout(timeout);

  before(function() {
    var args = ['/c', 'ReactiveTraderCloud-dev.exe'];
    spawn('cmd.exe', args);
    app = new Application({
      connectionRetryCount: 1,
      connectionRetryTimeout: timeout,
      startTimeout: timeout,
      waitTimeout: timeout,
      debuggerAddress: 'localhost:9090'
    });

    return app.start().then(
      function() {
        app.isRunning().should.equal(true);
        browser = app.client;
        browser.timeoutsImplicitWait(timeout);
        browser.timeoutsAsyncScript(timeout);
        browser.timeouts('page load', timeout);
      },
      function(err) {
        console.error(err);
      }
    );
  });

  after(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('Load RTC page and check the title', function() {
    return browser.getTitle().then(function(result) {
      should.equal(result, 'Reactive Trader Cloud');
    });
  });

  it('Find buy buttons', function() {
    return browser.elements('.price-button__pip').then(function(result) {
      should.exist(result.value);
    });
  });

  it('Check the number of tiles displayed is 9', function() {
    return browser.elements('.workspace-region__item').then(function(result) {
      should.equal(
        result.value.length,
        9,
        'Wrong number of elements displayed.'
      );
    });
  });

  it('Check the Profit & Loss tile is displayed', function() {
    return browser.getText('.analytics__header-title').then(function(result) {
      should.equal(result, 'Profit & Loss');
    });
  });

  it('Check the Positions and PnL tiles are displayed', function() {
    return browser.getText('.analytics__chart-title').then(function(result) {
      should.equal(result[0], 'Positions');
      should.equal(result[1], 'PnL');
    });
  });

  it('Check the grid table is displaying the correct headers', function() {
    const gridHeaderTitles = [
      'TRADE ID',
      'STATUS',
      'DATE',
      'DIRECTION',
      'CCYCCY',
      'DEALT CCY',
      'NOTIONAL',
      'RATE',
      'VALUE DATE',
      'TRADER'
    ];
    return browser
      .getText(
        'div.ag-cell-label-container.ag-header-cell-sorted-none > div.ag-header-cell-label > span.ag-header-cell-text'
      )
      .then(function(element) {
        should.exist(element);
        element.map(function(element, index) {
          should.equal(element, gridHeaderTitles[index]);
        });
      });
  });

  it('Hovering on the spot tile should reveal the spot date', () => {
    return browser.getText('.spot-tile__tenor').then(result => {
      result.map(res => {
        should.equal(res, 'SP');
      });
    });
  });

  it('Click and trade on a side to perform a trade', () => {
    return browser
      .click('.spot-tile__price--bid')
      .pause(1000)
      .then(() => {
        should.exist(
          browser.element('.trade-notification__summary-item--notional')
        );
      });
  });
  it('Enter a new notional by clicking into the text box', () => {
    return browser
      .clearElement('.notional__size-input')
      .setValue('.notional__size-input', '10000')
      .click('.spot-tile__price--bid')
      .pause(1000)
      .then(() => {
        should.exist(
          browser.element('.trade-notification__summary-item--notional')
        );
      });
  });
  it('GBP/JPY is ALWAYS rejected', () => {
    return browser
      .pause(5000)
      .elements('.spot-tile__price--bid')
      .then(result => {
        result.value.map(async (element, index) => {
          if (index === 3) {
            browser
              .elementIdClick(element.ELEMENT) // GBP/JPY sell button
              .waitForVisible('.trade-notification__trade-status', 5000)
              .getHTML('.trade-notification__trade-status', false)
              .then(text => {
                should.equal(text, 'Rejected');
              });
          }
        });
      });
  });
});
