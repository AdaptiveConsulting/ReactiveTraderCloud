//import React from 'react';
//import ReactDOM from 'react-dom';
//import routes from './routes';
//
//const target = document.getElementById('root');
//
//if (window.fin) {
//  target.classList.add('openfin');
//  //fin.desktop.main(() => {
//    //new window.fin.desktop.Notification({
//    //  url: '/#/growl',
//    //  message: 'hi'
//    //});
//  //});
//}
//
//ReactDOM.render(routes, target);

import services2 from 'services2';
import system from 'system';

var _log : system.logger.Logger = system.logger.create('App');

var url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
var autobahnProxy = new system.service.AutobahnConnectionProxy(url, realm);
var connection = new system.service.Connection('LMO', autobahnProxy);

var schedulerService = new system.SchedulerService();
var pricingServiceClient = new system.service.ServiceClient('pricing', connection, schedulerService);
var executionServiceClient = new system.service.ServiceClient('execution', connection, schedulerService);

var pricingService = new services2.PricingService(pricingServiceClient, schedulerService);

connection.connectionStatusStream.subscribe(status => {
  _log.info('Connection status changed to [{0}]', status);
},
ex => _log.error("ERROR:" + ex)
);
pricingServiceClient.serviceStatusSummaryStream.subscribe(status => {
  _log.info('Pricing service status summary [{0}]', JSON.stringify(status));
},
ex => _log.error("pricingServiceClient ERROR:" + ex)
);
executionServiceClient.serviceStatusSummaryStream.subscribe(status => {
  _log.info('Execution service status summary [{0}]', JSON.stringify(status));
},
ex => _log.error("executionServiceClient ERROR:" + ex)
);

pricingService.getPriceUpdates(new services2.model.GetSpotStreamRequest('EURUSD')).subscribe(price => {
  _log.info('Price received for EURUSD [{0}]', JSON.stringify(price));
});

pricingServiceClient.connect();
executionServiceClient.connect();
connection.connect();