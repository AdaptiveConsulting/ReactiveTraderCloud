var Application = require('spectron').Application;
var should = require('chai').should();
var spawn = require('child_process').spawn;

describe('application launch', function() {
  var app, client;
  var timeout = 30000;
  this.slow(20000);
  this.timeout(timeout);

  before(function() {
    if (process.platform === 'win32') {
      var args = ['/c', 'ReactiveTraderCloud-dev.exe'];
      spawn('cmd.exe', args);
    } else {
      spawn(
        config.desiredCapabilities.chromeOptions.binary,
        config.desiredCapabilities.chromeOptions.args
      );
    }
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
        client = app.client;
        client.timeoutsImplicitWait(timeout);
        client.timeoutsAsyncScript(timeout);
        client.timeouts('page load', timeout);
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

  it('Load RTC page and check the title ', function(done) {
    client.getTitle().then(function(result) {
      should.equal(result, 'Reactive Trader Cloud');
      done();
    });
  });

  it('Find buy buttons', function(done) {
    client.elements('.price-button__pip').then(function(result) {
      should.exist(result.value);
      done();
    });
  });

  it('Check the number of tiles displayed is 9', function(done) {
    client.elements('.workspace-region__item').then(function(result) {
      should.equal(
        result.value.length,
        9,
        'Wrong number of elements displayed.'
      );
      done();
    });
  });

  it('Check the Profit & Loss tile is displayed', function(done) {
    client.getText('.analytics__header-title').then(function(result) {
      should.equal(result, 'Profit & Loss');
      done();
    });
    client.getText('.analytics__chart-title').then(function(result) {
      should.equal(result, 'Positions');
      done();
    });
  });
});
