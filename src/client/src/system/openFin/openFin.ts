import * as _ from 'lodash'
import * as moment from 'moment'
import * as numeral from 'numeral'
import { Observable, Subject, Subscription } from 'rxjs/Rx'
import PositionsMapper from '../../services/mappers/positionsMapper'
import { CurrencyPair, Trade } from '../../types'
import logger from '../logger'

const log = logger.create('OpenFin')

const REQUEST_LIMIT_CHECK_TOPIC = 'request-limit-check'

export default class OpenFin {
  tradeClickedSubject
  limitCheckSubscriber: string
  limitCheckId

  constructor() {
    this.tradeClickedSubject = new Subject()
    this.limitCheckId = 1
    this.limitCheckSubscriber = null
    if (this.isRunningInOpenFin) {
      this.initializeLimitChecker()
    }
  }

  get isRunningInOpenFin() {
    return typeof fin !== 'undefined'
  }

  close(currentWindow = this.currentWindow) {
    currentWindow.close(
      true,
      () => log.info('Window closed with success.'),
      err => log.error('Failed to close window.', err)
    )
  }

  minimize(currentWindow = this.currentWindow) {
    currentWindow.minimize(
      () => log.info('Window minimized with success.'),
      err => log.error('Failed to minimize window.', err)
    )
  }

  maximize(currentWindow = this.currentWindow) {
    currentWindow.getState(state => {
      switch (state) {
        case 'maximized':
        case 'restored':
        case 'minimized':
          currentWindow.restore(
            () =>
              currentWindow.bringToFront(
                () => log.info('Window brought to front.'),
                err => log.error(err)
              ),
            err => log.error(err)
          )
          break
        default:
          currentWindow.maximize(
            () => log.info('Window maximized with success.'),
            err => log.error('Failed to maximize window.', err)
          )
      }
    })
  }

  bringToFront(currentWindow = this.currentWindow) {
    currentWindow.getState(state => {
      if (state === 'minimized') {
        currentWindow.restore(
          () =>
            currentWindow.bringToFront(
              () => log.info('Window brought to front.'),
              err => log.error(err)
            ),
          err => log.error(err)
        )
      } else {
        currentWindow.bringToFront(
          () => log.info('Window brought to front.'),
          err => log.error(err)
        )
      }
    })
  }

  addSubscription(name, callback) {
    if (!this.isRunningInOpenFin) {
      return
    }
    if (!fin.desktop.InterApplicationBus) {
      fin.desktop.main(() => {
        fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
          callback.call(null, msg, uuid)
        })
      })
    } else {
      fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
        callback.call(null, msg, uuid)
      })
    }
  }

  checkLimit(executablePrice, notional, tradedCurrencyPair) {
    return Observable.create(observer => {
      const disposables = new Subscription()
      if (this.limitCheckSubscriber === null) {
        log.debug('client side limit check not up, will delegate to to server')
        observer.next(true)
        observer.complete()
      } else {
        log.debug(`checking if limit is ok with ${this.limitCheckSubscriber}`)
        const topic = `limit-check-response (${this.limitCheckId++})`
        const limitCheckResponse = msg => {
          log.debug(
            `${this.limitCheckSubscriber} limit check response was ${msg}`
          )
          observer.next(msg.result)
          observer.complete()
        }

        fin.desktop.InterApplicationBus.subscribe(
          this.limitCheckSubscriber,
          topic,
          limitCheckResponse
        )

        fin.desktop.InterApplicationBus.send(
          this.limitCheckSubscriber,
          REQUEST_LIMIT_CHECK_TOPIC,
          {
            tradedCurrencyPair,
            notional,
            id: this.limitCheckId,
            responseTopic: topic,
            rate: executablePrice
          }
        )

        disposables.add(
          new Subscription(() => {
            fin.desktop.InterApplicationBus.unsubscribe(
              this.limitCheckSubscriber,
              topic,
              limitCheckResponse
            )
          })
        )
      }
      return disposables
    })
  }

  get currentWindow() {
    return fin.desktop.Window.getCurrent()
  }

  /**
   * Display External Chart
   * @param symbol
   * @returns {Promise|Promise<T>}
   */
  displayCurrencyChart(symbol) {
    return new Promise((resolve, reject) => {
      const chartIqAppId = 'ChartIQ'
      fin.desktop.System.getAllApplications(apps => {
        const chartIqApp = _.find(apps, (app: any) => {
          return app.isRunning && app.uuid === chartIqAppId
        })
        if (chartIqApp) {
          resolve(this.refreshCurrencyChart(symbol))
        } else {
          resolve(this.launchCurrencyChart(symbol))
        }
      })
    })
  }

  /**
   * Initialize limit checker
   * @private
   */
  initializeLimitChecker() {
    fin.desktop.main(() => {
      fin.desktop.InterApplicationBus.addSubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          log.info(`${uuid} has subscribed as a limit checker`)
          // There will only be one. If there are more, last subscriber will be used
          this.limitCheckSubscriber = uuid
        }
      })
      fin.desktop.InterApplicationBus.addUnsubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          log.info(`${uuid} has unsubscribed as a limit checker`)
          this.limitCheckSubscriber = null
        }
      })
    })
  }

  /**
   *
   * @param symbol
   * @returns {Promise<void>|Promise.<T>|Promise<T>}
   * @private
   */
  refreshCurrencyChart(symbol) {
    const interval = 5
    fin.desktop.InterApplicationBus.publish('chartiq:main:change_symbol', {
      symbol,
      interval
    })
    return Promise.resolve(symbol)
  }

  /**
   * @param symbol
   * @returns {Promise<T>|Promise}
   * @private
   */
  launchCurrencyChart(symbol) {
    return new Promise((resolve, reject) => {
      const interval = 5
      const chartIqAppId = 'ChartIQ'
      const url = `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/chartiq-shim.html?symbol=${symbol}&period=${interval}`
      const name = `chartiq_${new Date().getTime()}`
      const icon = 'http://adaptiveconsulting.github.io/chartiq/icon.png'
      const app = new fin.desktop.Application(
        {
          url,
          name,
          uuid: chartIqAppId,
          mainWindowOptions: {
            icon,
            autoShow: false
          }
        },
        () =>
          app.run(
            () => setTimeout(() => resolve(symbol), 1000),
            err => reject(err)
          ),
        err => reject(err)
      )
    })
  }

  openTradeNotification(trade: Trade, currencyPair: CurrencyPair) {
    if (!this.isRunningInOpenFin) {
      return
    }

    const tradeNotification = formatTradeNotification(trade, currencyPair)
    // tslint:disable-next-line
    new fin.desktop.Notification({
      url: '/index.html?notification=true',
      message: tradeNotification,
      duration: 20000,
      onClick: () => {
        this.bringToFront()
        // highlight trade row
        // this._router.publishEvent(WellKnownModelIds.blotterModelId, 'highlightTradeRow', { trade })
      }
    })
    fin.desktop.InterApplicationBus.publish(
      'blotter-new-item',
      tradeNotification
    )
  }

  publishCurrentPositions(ccyPairPositions) {
    if (!this.isRunningInOpenFin) {
      return
    }
    const serialisePositions = ccyPairPositions.map(p =>
      PositionsMapper.mapToDto(p)
    )
    fin.desktop.InterApplicationBus.publish(
      'position-update',
      serialisePositions
    )
  }

  publishPrice(price) {
    if (!this.isRunningInOpenFin) {
      return
    }
    fin.desktop.InterApplicationBus.publish('price-update', price)
  }

  sendAllBlotterData(
    uuid,
    blotterData: Trade[],
    currencyPairs: CurrencyPair[]
  ) {
    const parsed = Object.keys(blotterData).map(x =>
      formatTradeNotification(
        blotterData[x],
        currencyPairs[blotterData[x].symbol]
      )
    )

    fin.desktop.InterApplicationBus.send(uuid, 'blotter-data', parsed)
  }

  sendPositionClosedNotification(uuid, correlationId) {
    if (!this.isRunningInOpenFin) {
      return
    }
    fin.desktop.InterApplicationBus.send(uuid, 'position-closed', correlationId)
  }

  openLink(url) {
    fin.desktop.System.openUrlWithBrowser(url)
  }
}

function formatTradeNotification(trade: Trade, currencyPair: CurrencyPair) {
  return {
    symbol: trade.symbol,
    spotRate: trade.spotRate,
    notional: numeral(trade.notional).format('0,000,000[.]00'),
    direction: trade.direction,
    tradeId: trade.tradeId.toString(),
    tradeDate: moment(trade.tradeDate).format(),
    status: trade.status,
    dealtCurrency: trade.dealtCurrency,
    termsCurrency: currencyPair.terms,
    valueDate: moment.utc(trade.valueDate).format('DD MMM')
  }
}
