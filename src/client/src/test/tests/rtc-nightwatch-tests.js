// const host = 'http://172.31.4.113/';

const { getConfig } = require('../config');

const host = getConfig().host;
describe('Reactive Trader Cloud test', function() {
  describe('with Nightwatch', function() {
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
      this.slow(10000);
      client
        .url(host)
        .expect.element('body')
        .to.be.present.before(1000);
      client.pause(2000).assert.title('Reactive Trader Cloud');
    });

    it('Check the number of tiles displayed is 9', function(client) {
      client.elements('css selector', '.workspace-region__item', function(
        result
      ) {
        client.assert.equal(result.value.length, 9);
      });
    });
  });
});
