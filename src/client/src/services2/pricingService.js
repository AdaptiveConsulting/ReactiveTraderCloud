import system from 'system';
import rx from 'rx';
import * as model from './model';
import ServiceClient from './../system/service/serviceClient';

var _log : system.logger.Logger = system.logger.create('PricingService');

export default class PricingService {
    constructor(pricingServiceClient : system.service.ServiceClient){
        this._pricingServiceClient = pricingServiceClient;
    }
    getPriceUpdates(symbol : string) {
        return rx.Observable.create(
            observer => {
                _log.debug('Requesting price for {0}', symbol);
                var disposable = rx.Disposable.empty;
                try {

                } catch (err) {
                    observer.onError(err);
                }
                return disposable;
            }
        );
    }
}
