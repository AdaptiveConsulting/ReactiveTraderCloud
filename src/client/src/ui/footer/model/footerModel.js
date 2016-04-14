import { Router,  observeEvent } from 'esp-js/src';
import { CompositeStatusService } from '../../../services';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import { ServiceStatusLookup } from '../../../services/model';

var _log:logger.Logger = logger.create('FooterModel');

export default class FooterModel extends ModelBase {
  _compositeStatusService:CompositeStatusService;

  isConnectedToBroker:boolean;
  serviceLookup:ServiceStatusLookup;

  constructor(
    modelId:string,
    router:Router,
    compositeStatusService:CompositeStatusService
  ) {
    super(modelId, router);
    this._compositeStatusService = compositeStatusService;

    this.serviceLookup = new ServiceStatusLookup();
    this.isConnectedToBroker = false;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Footer model starting`);
    this._subscribeToConnectionStatus();
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
