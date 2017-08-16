import _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import { ReferenceDataMapper } from './mappers';
import { CurrencyPairUpdates, CurrencyPairUpdate, CurrencyPair, UpdateType } from './model';
import { logger, SchedulerService, RetryPolicy } from '../system';
import { Connection, ServiceBase } from '../system/service';
import '../system/observableExtensions/retryPolicyExt';
var _log = logger.create('ReferenceDataService');

export default class ReferenceDataService extends ServiceBase {
  _referenceDataMapper;
  _referenceDataStreamConnectable;
  _currencyPairCache;

  constructor(serviceType, connection, schedulerService) {
    super(serviceType, connection, schedulerService);
    this._referenceDataMapper = new ReferenceDataMapper();
    this._referenceDataStreamConnectable = this._referenceDataStream().publish();
    this._currencyPairCache = {
      hasLoaded:false
    };

    // on connection/reconnection get reference data stream
    connection.connectionStatusStream.filter(el => el === 'connected').subscribe(() => {
      // TEMP force refdata reconnecting
      this._serviceClient._isConnectCalled = false;
      this._referenceDataStreamConnectable._connection = null;

      this.addDisposable(this._referenceDataStreamConnectable.connect());
    });
  }

  getCurrencyPair(symbol) {
    if (!this._currencyPairCache.hasLoaded) {
      throw new Error('Reference data cache hasn\'t finished loading');
    }
    if (!this._currencyPairCache.hasOwnProperty(symbol)) {
      throw new Error(`CurrencyPair with symbol [${symbol}] is not in the cache.`);
    }
    return this._currencyPairCache[symbol];
  }

  getCurrencyPairUpdatesStream() {
    return this._referenceDataStreamConnectable;
  }

  _referenceDataStream() {
    let _this = this;
    return Observable.create(
      o => {
        _log.debug('Subscribing reference data stream');
        return _this._serviceClient
          .createStreamOperation('getCurrencyPairUpdatesStream', {/* noop request */})
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getCurrencyPairUpdatesStream', _this._schedulerService.async)
          .map(data => _this._referenceDataMapper.mapCurrencyPairsFromDto(data))
          .subscribe(
            (updates) => {
              // note : we have a side effect here.
              // In this instance it's ok as this stream is published and ref counted, i.e. there is only ever 1
              // and this services is designed to be run at startup and other calls should block until it's loaded.
              // The intent here is all reference data should be exposed via both a synchronous and push API.
              // Push only (i.e. Observable only) APIs within applications for data that is effectively already known are a pain to work with.
              _this._updateCache(updates);
              o.next(updates);
            },
            err => {
              o.error(err);
            },
            () => {
              o.complete();
            }
          );
      }
    );
  }

  _updateCache(update) {
    _.forEach(update.currencyPairUpdates, (currencyPairUpdate) => {
      if (currencyPairUpdate.updateType == UpdateType.Added) {
        this._currencyPairCache[currencyPairUpdate.currencyPair.symbol] = currencyPairUpdate.currencyPair;
      } else if (currencyPairUpdate.updateType == UpdateType.Removed) {
        delete this._currencyPairCache[currencyPairUpdate.currencyPair.symbol];
      }
    });
    if(!this._currencyPairCache.hasLoaded && update.currencyPairUpdates.length > 0) {
      this._currencyPairCache.hasLoaded = true;
    }
  }
}
