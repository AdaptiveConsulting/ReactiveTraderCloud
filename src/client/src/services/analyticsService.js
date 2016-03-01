import system from 'system';
import _ from 'lodash';
import Rx from 'rx';
import { AnalyticsRequest, PositionUpdates, CurrencyPairPosition, HistoricPosition } from './model';
import { PositionsMapper } from './mappers';

var _log:system.logger.Logger = system.logger.create('AnalyticsService');

export default class AnalyticsService extends system.service.ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
    super(serviceType, connection, schedulerService);
    this._positionsMapper = new PositionsMapper();
  }

  getAnalyticsStream(analyticsRequest:AnalyticsRequest):Rx.Observable<PositionUpdates> {
    system.Guard.isDefined(analyticsRequest, 'analyticsRequest required');
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.debug('Subscribing to analytics stream');
        return _this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', _this._schedulerService.async)
          .select(dto => _this._positionsMapper.mapFromDto(dto))
          .subscribe(o);
      }
    );
  }
}
