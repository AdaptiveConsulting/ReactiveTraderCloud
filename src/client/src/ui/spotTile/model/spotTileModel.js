import { Router, model, observeEvent } from 'esp-js/src';
import { ReferenceDataService, PricingService, ExecutionService } from '../../../services';
import { CurrencyPairUpdates } from '../../../services/model';
import { logger } from '../../../system';
import { ServiceStatus } from '../../../system/service';
import { CurrencyPair } from '../../../services/model';
import { ModelBase } from '../../common';
import { GetSpotStreamRequest, SpotPrice } from '../../../services/model';
import { TileStatus } from './';

var _log:logger.Logger = logger.create('SpotTileModel');

let modelIdKey = 1;

export default class SpotTileModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _currencyPair:CurrencyPair;

  currentSpotPrice:SpotPrice;
  canTrade:Boolean;
  status:TileStatus;

  constructor(currencyPair:CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state as we do here
              router,
              referenceDataService:ReferenceDataService,
              pricingService:PricingService,
              executionService:ExecutionService) {
    super((`spotTileModel` + modelIdKey++), router);
    this._referenceDataService = referenceDataService;
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._currencyPair = currencyPair;

    this.status = TileStatus.Listening;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Cash tile starting for pair ${this._currencyPair.symbol}`);
    this._subscribeToPriceStream();
    this._subscribeToConnectionStatus();
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    _log.info(`Cash tile closing`);
  }

  _subscribeToPriceStream() {
    this.addDisposable(
      this._pricingService
        .getSpotPriceStream(new GetSpotStreamRequest(this._currencyPair.symbol))
        .subscribeWithRouter(
          this.router,
          this._modelId,
          (price:SpotPrice) => {
            this.currentSpotPrice = price;
          },
          err => {
            _log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
  }

  _subscribeToConnectionStatus() {
    let serviceStatusStream = Rx.Observable.combineLatest(
      this._pricingService.serviceStatusStream,
      this._pricingService.executionService,
      (pricingStatus, executionStatus) => {
        return {
          pricingStatus: pricingStatus,
          executionStatus: executionStatus
        };
      });
    this.addDisposable(
      serviceStatusStream.subscribeWithRouter(
        this.router,
        this._modelId,
        (status:ServiceStatus) => {

        })
    );
  }
}
