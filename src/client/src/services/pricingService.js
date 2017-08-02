import { Observable } from 'rxjs/Rx';
import { SpotPrice, GetSpotStreamRequest } from './model';
import { PriceMapper } from './mappers';
import { ReferenceDataService } from './';
import { Connection, ServiceBase } from '../system/service';
import { logger, SchedulerService, RetryPolicy } from '../system';
import '../system/observableExtensions/retryPolicyExt';


var _log = logger.create('PricingService');

export default class PricingService extends ServiceBase {

  constructor(serviceType, connection, schedulerService, referenceDataService) {
    super(serviceType, connection, schedulerService);
    this._priceMapper = new PriceMapper(referenceDataService);
  }

  getSpotPriceStream(request) {
    let _this = this;
    const getPriceUpdatesOperationName = 'getPriceUpdates';
    return Observable.create(
      o => {
        _log.debug(`Subscribing to spot price stream for [${request.symbol}]`);
        let lastPrice = null;
        return _this._serviceClient
          .createStreamOperation(getPriceUpdatesOperationName, request)
          // we retry the price stream forever, if it errors (likely connection down) we pump a non tradable price
          .retryWithPolicy(
            RetryPolicy.indefiniteEvery2Seconds,
            getPriceUpdatesOperationName,
            _this._schedulerService.async,
            (err, willRetry) => {
              if(willRetry && lastPrice !== null) {
                // if we have any error on the price stream we pump a stale price
                let stalePrice = new SpotPrice(
                  lastPrice.symbol,
                  lastPrice.ratePrecision,
                  lastPrice.bid,
                  lastPrice.ask,
                  lastPrice.mid,
                  lastPrice.valueDate,
                  lastPrice.creationTimestamp,
                  lastPrice.priceMovementType,
                  lastPrice.spread,
                  false
                );
                o.next(stalePrice);
              }
            }
          )
          // scan the price stream (i.e. build a previous-next tuple) so we can determine the PriceMovementType in the mapper
          .scan((accumulator, nextPriceDto) => {
              return {
                lastPriceDto: accumulator.nextPriceDto,
                nextPriceDto: nextPriceDto
              };
            },
            { lastPriceDto: null, nextPriceDto: null } // the accumulator seed for the scan function
          )
          .map(tuple => _this._priceMapper.mapFromSpotPriceDto(tuple.lastPriceDto, tuple.nextPriceDto))
          .subscribe(
            (price) => {
              lastPrice = price;
              o.next(price);
            },
            err => { o.error(err); },
            () => { o.complete(); }
          );
      }
    );
  }
}
