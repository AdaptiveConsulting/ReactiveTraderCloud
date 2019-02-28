import {
  createConnection,
  EventAppearedCallback,
  EventStoreNodeConnection,
  UserCredentials,
} from 'node-eventstore-client'
import { Observable } from 'rxjs'

const TradeCompletedEvent = 'TradeCompletedEvent'
const TradeRejectedEvent = 'TradeRejectedEvent'
const TradeCreatedEvent = 'TradeCreatedEvent'

const TradeEvents = [TradeCompletedEvent, TradeRejectedEvent, TradeCreatedEvent]

const credentials = new UserCredentials('admin', 'changeit')

const esConnection = createConnection(
  { verboseLogging: false, log: console, defaultUserCredentials: credentials },
  'tcp://localhost:1113',
)
const subscriptionDropped = (subscription: any, reason: any, error: any) =>
  console.log(error ? error : 'Subscription dropped.')

const createEventStream = (esConnection: EventStoreNodeConnection) =>
  new Observable<Trade>(obs => {
    const eventAppeared: EventAppearedCallback<any> = (subscription, event) => {
      if (event && event.event && event.event.data && TradeEvents.includes(event.event.eventType)) {
        obs.next(JSON.parse(event.event.data.toString()))
      }
    }

    esConnection.subscribeToAllFrom(null, false, eventAppeared, undefined, subscriptionDropped, credentials)
  })

esConnection.connect().then(_ => {
  createEventStream(esConnection).subscribe(x => {
    console.log(x)
  })
})

interface Trade {
  TradeId: number
  CurrencyPair: string
  TraderName: string
  Notional: number
  DealtCurrency: string
  Direction: string
  Status: string
  SpotRate: number
  TradeDate: string
  ValueDate: string
}
esConnection.subscribeToAllFrom(null, false, eventAppeared, libeProcessingStarted, subscriptionDropped, credentials)
