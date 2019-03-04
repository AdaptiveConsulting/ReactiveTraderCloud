import { ServiceStubWithLoadBalancer } from "rt-system";
import { SpotPriceTick } from "../model";

export const getHistoricPrices = (serviceStub:ServiceStubWithLoadBalancer, ccyPair:string)=>{
    return serviceStub.createRequestResponseOperation<SpotPriceTick[], string>('priceHistory', 'getPriceHistory', ccyPair)
}
