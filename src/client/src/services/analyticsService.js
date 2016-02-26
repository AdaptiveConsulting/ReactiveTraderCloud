import system from 'system';
import _ from 'lodash';
import Rx from 'rx';
import { AnalyticsRequest, PositionUpdates, CurrencyPairPosition, HistoricPosition } from './model';

var _log:system.logger.Logger = system.logger.create('AnalyticsService');

export default class AnalyticsService extends system.service.ServiceBase {

  getAnalyticsStream(analyticsRequest:AnalyticsRequest) {
    system.Guard.isDefined(analyticsRequest, 'analyticsRequest required');

    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', _this._schedulerService.async)
          .select(dto => this._mapFromDto(dto))
          .subscribe(o);
      }
    );
  }

  _mapFromDto(dto:Object):PositionUpdates {
    let positions = this._mapPositionsFromDto(dto.CurrentPositions);
    let history = this._mapHistoricPositionFromDto(dto.History);
    return new PositionUpdates(positions, history);
  }

  _mapPositionsFromDto(dtos:Array<Object>) {
    return _(dtos).map(
      dto => new CurrencyPairPosition(
        dto.Symbol,
        dto.BasePnl,
        dto.BaseTradedAmount))
      .value();
  }

  _mapHistoricPositionFromDto(dtos:Array<Object>) {
    return _(dtos)
      .map(dto => new HistoricPosition(new Date(dto.Timestamp), dto.UsdPnl))
      .value();
  }
}
