import _ from 'lodash';
import Rx from 'rx';
import { Connection, ServiceBase } from '../system/service';
import { AnalyticsRequest, PositionUpdates, CurrencyPairPosition, HistoricPosition } from './model';
import { PositionsMapper } from './mappers';
import { Guard, logger, SchedulerService, RetryPolicy } from '../system';

var _log:logger.Logger = logger.create('AnalyticsService');

export default class AnalyticsService extends ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
    super(serviceType, connection, schedulerService);
    this._positionsMapper = new PositionsMapper();
  }

  getAnalyticsStream(analyticsRequest:AnalyticsRequest):Rx.Observable<PositionUpdates> {
    Guard.isDefined(analyticsRequest, 'analyticsRequest required');
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.debug('Subscribing to analytics stream');
        return _this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', _this._schedulerService.async)
          .select(dto => _this._positionsMapper.mapFromDto(dto))
          .subscribe(o);
      }
    );
  }
}
