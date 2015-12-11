import Rx from 'rx';
import system from 'system';
import StubAutobahnProxy from './stubAutobahnProxy';

describe('ServiceClient', () => {
  let _stubAutobahnProxy, _connection, _receivedServiceStatusUpdates, _serviceClient, _scheduler;

  beforeEach(() => {
      _scheduler = new Rx.TestScheduler();
      _stubAutobahnProxy = new StubAutobahnProxy();
      var stubSchedulerService = {
          timeout: _scheduler
      }
      _connection = new system.service.Connection(_stubAutobahnProxy);
      _serviceClient = new system.service.ServiceClient('pricing', _connection, stubSchedulerService);
      _receivedServiceStatusUpdates = [];
      _serviceClient.serviceStatusSummaryStream.subscribe(statusSummary => {
          _receivedServiceStatusUpdates.push(statusSummary);
      });
  });


    // TODO service instance connections via serviceClient.serviceStatusSummaryStream,

    /*
     Example status
     [{"Type":"execution","Instance":"execution.1b27","Timestamp":"2015-12-11T16:38:41.028972+00:00","Load":0}]
     [{"Type":"pricing","Instance":"pricing.12b6","Timestamp":"2015-12-11T16:38:40.987076+00:00","Load":0}]
     [{"Type":"reference","Instance":"reference.aa3e","Timestamp":"2015-12-11T16:38:40.028915+00:00","Load":0}]
     [{"Type":"blotter","Instance":"blotter.92ec","Timestamp":"2015-12-11T16:38:41.029013+00:00","Load":0}]
     * */

  //it('test the foos 2', function () {
  //  expect(true).to.equal(true);
  //});

});
