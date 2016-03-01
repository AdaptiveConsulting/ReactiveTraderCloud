import system from 'system';
import Rx from 'rx';
import { ReferenceDataMapper } from './mappers';
import { CurrencyPairUpdates } from './model';

var _log:system.logger.Logger = system.logger.create('ReferenceDataService');

export default class ReferenceDataService extends system.service.ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
    super(serviceType, connection, schedulerService);
    this._referenceDataMapper = new ReferenceDataMapper();
  }

  getCurrencyPairUpdatesStream() : Rx.Observable<CurrencyPairUpdates> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.debug('Subscribing reference data stream');
        return _this._serviceClient
          .createStreamOperation('getCurrencyPairUpdatesStream', {/* noop request */ })
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getCurrencyPairUpdatesStream', _this._schedulerService.async)
          .select(data => _this._referenceDataMapper.mapCurrencyPairsFromDto(data))
          .subscribe(o);
      }
    );
  }
}
