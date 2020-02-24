import { ReplaySubject } from 'rxjs';
import { map, multicast, refCount, scan, share, shareReplay } from 'rxjs/operators';
import AutobahnConnectionProxy, { createConnection$, ServiceStub } from './connection';
import { ServiceCollectionMap } from './connection/ServiceInstanceCollection';
import { serviceStatusStream$ } from './connection/serviceStatusStream';
import ServiceStubWithLoadBalancer from './connection/ServiceStubWithLoadBalancer';
import { convertToPrice, Price, RawPrice, RawServiceStatus, TradeUpdate } from './domain';
import logger from './logger';

const HEARTBEAT_TIMEOUT = 3000

function getPriceMovementType(prevItem: Price, newItem: Price) {
    const prevPriceMove = prevItem.lastMove
    const lastPrice = prevItem.mid
    const nextPrice = newItem.mid
    if (lastPrice < nextPrice) {
        return 'up'
    }
    if (lastPrice > nextPrice) {
        return 'down'
    }
    return prevPriceMove
}
export function createApplicationServices(host: string, realm: string, port: string) {

    logger.info(`Started bot-service for ${host}:${port} on realm ${realm}`)

    const autobahn = new AutobahnConnectionProxy(host, realm!, +port!)
    const connection$ = createConnection$(autobahn).pipe(shareReplay(1))
    const stub = new ServiceStub('RT-Bot', connection$)

    const statusUpdates$ = stub.subscribeToTopic<RawServiceStatus>('status')
    const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
        multicast(() => {
            return new ReplaySubject<ServiceCollectionMap>(1)
        }),
        refCount(),
    )
    const loadBalancedServiceStub = new ServiceStubWithLoadBalancer(stub, serviceStatus$)


    const tradeStream$ = loadBalancedServiceStub.createStreamOperation<TradeUpdate>('blotter', 'getTradesStream', {}).pipe(share());


    const priceSubsription$ = stub
        .subscribeToTopic<RawPrice>('prices')
        .pipe(
            map(price => convertToPrice(price)),
            scan<Price, Map<string, Price>>((acc, price) => {
                if (acc.has(price.symbol)) {
                    price.lastMove = getPriceMovementType(acc.get(price.symbol)!, price)
                }
                return acc.set(price.symbol, price)
            },
                new Map<string, Price>()),
            share()
        )

    return { tradeStream$, priceSubsription$ }
}

export type RTServices = ReturnType<typeof createApplicationServices>


