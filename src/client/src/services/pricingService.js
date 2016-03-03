import Rx from 'rx';
import { SpotPrice, GetSpotStreamRequest } from './model';
import { PriceMapper } from './mappers';
import { ReferenceDataService } from './';
import { Connection, ServiceBase } from '../system/service';
import { logger, SchedulerService, RetryPolicy } from '../system';

var _log:logger.Logger = logger.create('PricingService');

export default class PricingService extends ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService, referenceDataService:ReferenceDataService) {
    super(serviceType, connection, schedulerService);
    this._priceMapper = new PriceMapper(referenceDataService);
  }

  getSpotPriceStream(request:GetSpotStreamRequest):Rx.Observable<SpotPrice> {
    let _this = this;
    const getPriceUpdatesOperationName = 'getPriceUpdates';
    return Rx.Observable.create(
      o => {
        _log.debug(`Subscribing to spot price stream for [${request.symbol}]`);
        let accumulatorSeed = {
          lastPriceDto: null,
          nextPriceDto: null
        };
        return _this._serviceClient
          .createStreamOperation(getPriceUpdatesOperationName, request)
          .retryWithPolicy(RetryPolicy.indefiniteEvery2Seconds, getPriceUpdatesOperationName, _this._schedulerService.async)
          .scan((accumulator, nextPriceDto) => {
              return {
                lastPriceDto: accumulator.nextPriceDto,
                nextPriceDto: nextPriceDto
              };
            },
            accumulatorSeed)
          .select(tuple => _this._priceMapper.mapFromSpotPriceDto(tuple.lastPriceDto, tuple.nextPriceDto))
          .subscribe(o);
      }
    );
  }
}
