import { Router,  observeEvent } from 'esp-js/src';
import { CompositeStatusService, FakeUserRepository } from '../../../services';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import { ServiceStatusLookup } from '../../../services/model';

var _log:logger.Logger = logger.create('HeaderModel');

export default class HeaderModel extends ModelBase {
  _compositeStatusService:CompositeStatusService;

  isConnectedToBroker:boolean;
  serviceLookup:ServiceStatusLookup;

  constructor(
    router:Router,
    compositeStatusService:CompositeStatusService
  ) {
    super('headerModelId', router);
    this._compositeStatusService = compositeStatusService;

    this.serviceLookup = new ServiceStatusLookup();
    this.isConnectedToBroker = false;
    this.currentUser = FakeUserRepository.currentUser;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Header model starting`);
    this._subscribeToConnectionStatus();
  }

  @observeEvent('externalLinkClicked')
  _onExternalLinkClicked() {
    _log.info(`external link clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('minimiseClicked')
  _onMinimiseClicked(e) {
    _log.info(`minimise clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('maximiseClicked')
  _onMaximiseClicked() {
    _log.info(`maximise clicked`);
    // TODO , if in open fin deal with launching the link
  }

  @observeEvent('closeClicked')
  _onCloseClicked() {
    _log.info(`closed clicked`);
    // TODO , if in open fin deal with launching the link
  }

  _subscribeToConnectionStatus() {
    this.addDisposable(
      this._compositeStatusService.serviceStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (serviceStatusLookup:ServiceStatusLookup) => {
          this.serviceLookup = serviceStatusLookup;
        })
    );
    this.addDisposable(
      this._compositeStatusService.connectionStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (isConnected:boolean) => {
          this.isConnectedToBroker = isConnected;
        })
    );
  }
}
