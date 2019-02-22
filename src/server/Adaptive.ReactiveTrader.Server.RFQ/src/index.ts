import { Connection } from 'autobahn'
import {
  createConnection,
  UserCredentials,
  EventStoreNodeConnection,
  FileLogger,
  Logger,
  EventAppearedCallback,
  RecordedEvent,
} from 'node-eventstore-client'
import { EventEmitter } from 'events'
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
//esConnection.subscribeToAllFrom(null, false, eventAppeared, libeProcessingStarted, subscriptionDropped, credentials)

// const connection = new Connection({
//   url: 'ws://web-dev.adaptivecluster.com:80/ws',
//   realm: 'com.weareadaptive.reactivetrader',
//   use_es6_promises: true,
// })

// connection.onopen = session => {
//     console.log('tick')
//   setInterval(() => {
//     session.publish('status', [
//       { Type: 'newService', Instance: 'new one', Timestamp: new Date().toUTCString(), Load: 0 },
//     ])
//   }, 1000)
// }

// connection.onclose = (reason: string, details: any) => {
//   console.error(reason, details)
//   return false
// }

// connection.open()
