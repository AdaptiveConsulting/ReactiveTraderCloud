import { Observable } from 'rxjs/Rx';
import { ServiceBase } from '../system/service';
import { PositionsMapper } from './mappers';
import { Guard, logger, RetryPolicy } from '../system';
import '../system/observableExtensions/retryPolicyExt';

var _log = logger.create('AnalyticsService');

export default class AnalyticsService extends ServiceBase {

  constructor(serviceType, connection, schedulerService, referenceDataService) {
    super(serviceType, connection, schedulerService);
    this._positionsMapper = new PositionsMapper(referenceDataService);
  }

  getAnalyticsStream(analyticsRequest) {
    Guard.isDefined(analyticsRequest, 'analyticsRequest required');
    let _this = this;
    return Observable.create(
      o => {
        _log.debug('Subscribing to analytics stream');

        return _this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', _this._schedulerService.async)
          .map(dto => _this._positionsMapper.mapFromDto(dto))
          .subscribe(o);
      }
    );
  }
}
