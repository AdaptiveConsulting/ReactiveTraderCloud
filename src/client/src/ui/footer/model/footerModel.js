import { Router,  observeEvent } from 'esp-js/src';
import { CompositeStatusService } from '../../../services';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import { ServiceStatusLookup, ApplicationStatusConst } from '../../../services/model';
import { ConnectionStatus } from '../../../system/service';
import _ from 'lodash';

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
    this.shouldShowServiceStatus = false;
    this.applicationStatus = ApplicationStatusConst.Unknown;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Footer model starting`);
    this._subscribeToConnectionStatus();
  }

  @observeEvent('toggleServiceStatus')
  _onToggleServiceStatus() {
    _log.debug(`toggling service status`);
    this.shouldShowServiceStatus = !this.shouldShowServiceStatus;
  }


  _subscribeToConnectionStatus() {
    this.addDisposable(
      this._compositeStatusService.serviceStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (serviceStatusLookup:ServiceStatusLookup) => {
          const services = Object.keys(serviceStatusLookup.services)
                                 .map(key => serviceStatusLookup.services[key]);
          this.serviceLookup = serviceStatusLookup;
          if (_.every(services, 'isConnected')) {
            this.applicationStatus = ApplicationStatusConst.Healthy;
          } else if (_.some(services, 'isConnected')) {
            this.applicationStatus = ApplicationStatusConst.Warning;
          } else {
            this.applicationStatus = ApplicationStatusConst.Down;
          }
        })
    );
    this.addDisposable(
      this._compositeStatusService.connectionStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (connectionStatus:String) => {
          this.isConnectedToBroker = connectionStatus === ConnectionStatus.connected;
          this.connectionUrl = this._compositeStatusService.connectionUrl;
        })
    );
  }
}
