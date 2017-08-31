import { Observable, Subject, Subscription } from 'rxjs/Rx'
import * as _ from 'lodash'
import { TradeNotification } from '../../services/model'
import PositionsMapper from '../../services/mappers/positionsMapper'
import logger from '../logger'

const _log = logger.create('OpenFin')

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
      this._initializeLimitChecker()
    }
  }

  get isRunningInOpenFin() {
    return typeof fin !== 'undefined'
  }

  close(currentWindow = this._currentWindow) {
    currentWindow.close(true, () => _log.info('Window closed with success.'), err => _log.error('Failed to close window.', err))
  }

  minimize(currentWindow = this._currentWindow) {
    currentWindow.minimize(() => _log.info('Window minimized with success.'), err => _log.error('Failed to minimize window.', err))
  }

  maximize(currentWindow = this._currentWindow) {
    currentWindow.getState(state => {
        switch (state){
          case 'maximized':
          case 'restored':
          case 'minimized':
            currentWindow.restore(() => currentWindow.bringToFront(
              () => _log.info('Window brought to front.'),
              err => _log.error(err)
            ), err => _log.error(err))
            break
          default:
            currentWindow.maximize(() => _log.info('Window maximized with success.'), err => _log.error('Failed to maximize window.', err))
        }
      })
  }

  bringToFront(currentWindow = this._currentWindow){
    currentWindow.getState(state => {
      if (state === 'minimized'){
        currentWindow.restore(() => currentWindow.bringToFront(
          () => _log.info('Window brought to front.'),
          err => _log.error(err)
        ), err => _log.error(err))
      }else{
        currentWindow.bringToFront(
          () => _log.info('Window brought to front.'),
          err => _log.error(err))
      }
    })
  }

  addSubscription(name, callback){
    if (!this.isRunningInOpenFin) return
    if (!fin.desktop.InterApplicationBus){
      fin.desktop.main(() => {
        fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
          callback.call(null, msg, uuid)
        })
      })
    }else{
      fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
        callback.call(null, msg, uuid)
      })
    }
  }

  checkLimit(executablePrice, notional, tradedCurrencyPair) {
    const _this = this
    return Observable.create(observer => {
        const disposables = new Subscription()
        if (_this.limitCheckSubscriber === null) {
          _log.debug('client side limit check not up, will delegate to to server')
          observer.next(true)
          observer.compconste()
        } else {
          _log.debug(`checking if limit is ok with ${_this.limitCheckSubscriber}`)
          const topic = `limit-check-response (${_this.limitCheckId++})`
          const limitCheckResponse = (msg) => {
            _log.debug(`${_this.limitCheckSubscriber} limit check response was ${msg}`)
            observer.next(msg.result)
            observer.compconste()
          }

          fin.desktop.InterApplicationBus.subscribe(_this.limitCheckSubscriber, topic, limitCheckResponse)

          fin.desktop.InterApplicationBus.send(_this.limitCheckSubscriber, REQUEST_LIMIT_CHECK_TOPIC, {
            id: _this.limitCheckId,
            responseTopic: topic,
            tradedCurrencyPair: tradedCurrencyPair,
            notional: notional,
            rate: executablePrice
          })

          disposables.add(new Subscription(() => {
            fin.desktop.InterApplicationBus.unsubscribe(_this.limitCheckSubscriber, topic, limitCheckResponse)
          }))
        }
        return disposables
      })
  }

  get _currentWindow() {
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
      fin.desktop.System.getAllApplications((apps) => {
        const chartIqApp = _.find(apps, ((app: any) => {
          return app.isRunning && app.uuid === chartIqAppId
        }))
        if (chartIqApp) {
          resolve(this._refreshCurrencyChart(symbol))
        } else {
          resolve(this._launchCurrencyChart(symbol))
        }
      })
    })
  }

  /**
   * Initialize limit checker
   * @private
   */
  _initializeLimitChecker() {
    fin.desktop.main(() => {
      fin.desktop.InterApplicationBus.addSubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          _log.info(`${uuid} has subscribed as a limit checker`)
          // There will only be one. If there are more, last subscriber will be used
          this.limitCheckSubscriber = uuid
        }
      })
      fin.desktop.InterApplicationBus.addUnsubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          _log.info(`${uuid} has unsubscribed as a limit checker`)
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
  _refreshCurrencyChart(symbol) {
    const interval = 5
    fin.desktop.InterApplicationBus.publish('chartiq:main:change_symbol', { symbol, interval })
    return Promise.resolve(symbol)
  }

  /**
   * @param symbol
   * @returns {Promise<T>|Promise}
   * @private
   */
  _launchCurrencyChart(symbol) {
    return new Promise((resolve, reject) => {
      const interval = 5
      const chartIqAppId = 'ChartIQ'
      const url = `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/chartiq-shim.html?symbol=${symbol}&period=${interval}`
      const name = `chartiq_${(new Date()).getTime()}`
      const applicationIcon = 'http://adaptiveconsulting.github.io/chartiq/icon.png'
      const app = new fin.desktop.Application({
        url,
        name,
        applicationIcon,
        uuid: chartIqAppId,
        mainWindowOptions: {
          autoShow: false,
        },
      }, () => app.run(() => setTimeout(() => resolve(), 1000), err => reject(err)), err => reject(err))
    })
  }

  openTradeNotification(trade) {
    if (!this.isRunningInOpenFin) return

    const tradeNotification = new TradeNotification(trade)
    new fin.desktop.Notification({
      url: '/notification.html',
      message: tradeNotification,
      onClick: () => {
        this.bringToFront()
        // highlight trade row
        // this._router.publishEvent(WellKnownModelIds.blotterModelId, 'highlightTradeRow', { trade })
      },
    })
    fin.desktop.InterApplicationBus.publish('blotter-new-item', tradeNotification)
  }

  publishCurrentPositions(ccyPairPositions) {
    if (!this.isRunningInOpenFin ) return
    const serialisePositions = ccyPairPositions.map( p => PositionsMapper.mapToDto(p))
    fin.desktop.InterApplicationBus.publish('position-update', serialisePositions)
  }

  publishPrice(price) {
    if (!this.isRunningInOpenFin) return

    console.warn('PriceMapper.mapToSpotPriceDto moved to spotTileItemFormatter')
    // fin.desktop.InterApplicationBus.publish('price-update', PriceMapper.mapToSpotPriceDto(price))
  }

  sendAllBlotterData(uuid, blotterData){
    fin.desktop.InterApplicationBus.send(uuid, 'blotter-data', blotterData)
  }

  sendPositionClosedNotification(uuid, correlationId){
    fin.desktop.InterApplicationBus.send(uuid, 'position-closed', correlationId)
  }

  openLink(url) {
    fin.desktop.System.openUrlWithBrowser(url)
  }
}
