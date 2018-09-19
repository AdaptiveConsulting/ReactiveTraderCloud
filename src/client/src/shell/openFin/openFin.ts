import logdown from 'logdown'
import { Observable } from 'rxjs'

const LOG_NAME = 'OpenFin: '
const logger = logdown(`app:${LOG_NAME}`, { prefixColor: 'Magenta' })
const errorLogger = logdown(`app:${LOG_NAME} Error `, { prefixColor: 'Tomato' })

const REQUEST_LIMIT_CHECK_TOPIC = 'request-limit-check'

export default class OpenFin {
  private limitCheckSubscriber: string | null = null
  private limitCheckId: number = 1

  constructor() {
    if (this.isPresent) {
      this.initializeLimitChecker()
    }
  }

  get isPresent() {
    return typeof fin !== 'undefined'
  }

  close = () => {
    fin.desktop.Application.getCurrent().close()
  }

  minimize = () => {
    this.currentWindow.minimize(
      () => logger.info('Window minimized with success.'),
      err => errorLogger.error('Failed to minimize window.', err),
    )
  }

  maximize = () => {
    this.currentWindow.getState(state => {
      switch (state) {
        case 'maximized':
        case 'restored':
        case 'minimized':
          this.currentWindow.restore(
            () =>
              this.currentWindow.bringToFront(
                () => logger.info('Window brought to front.'),
                err => errorLogger.error(err),
              ),
            err => errorLogger.error(err),
          )
          break
        default:
          this.currentWindow.maximize(
            () => logger.info('Window maximized with success.'),
            err => errorLogger.error('Failed to maximize window.', err),
          )
      }
    })
  }

  bringToFront(currentWindow: fin.OpenFinWindow = this.currentWindow) {
    currentWindow.getState(state => {
      if (state === 'minimized') {
        currentWindow.restore(
          () =>
            currentWindow.bringToFront(() => logger.info('Window brought to front.'), err => errorLogger.error(err)),
          err => errorLogger.error(err),
        )
      } else {
        currentWindow.bringToFront(() => logger.info('Window brought to front.'), err => errorLogger.error(err))
      }
    })
  }

  addSubscription(name: string, callback: (msg: any, uuid: any) => void) {
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

  rpc(message: object) {
    return new Observable<boolean>(observer => {
      if (this.limitCheckSubscriber === null) {
        logger.info('client side limit check not up, will delegate to to server')
        observer.next(true)
        observer.complete()
        return
      }

      logger.info(`checking if limit is ok with ${this.limitCheckSubscriber}`)

      const topic = `limit-check-response (${this.limitCheckId++})`

      const limitCheckResponse = (msg: { result: boolean }) => {
        logger.info(`${this.limitCheckSubscriber} limit check response was ${msg}`)
        observer.next(msg.result)
        observer.complete()
      }

      fin.desktop.InterApplicationBus.subscribe(this.limitCheckSubscriber, topic, limitCheckResponse)

      const payload = {
        ...message,
        id: this.limitCheckId,
        responseTopic: topic,
      }

      fin.desktop.InterApplicationBus.send(this.limitCheckSubscriber, REQUEST_LIMIT_CHECK_TOPIC, payload)

      return () => {
        fin.desktop.InterApplicationBus.unsubscribe(this.limitCheckSubscriber!, topic, limitCheckResponse)
      }
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
  displayCurrencyChart(symbol: string) {
    return new Promise<string>((resolve, reject) => {
      const chartIqAppId = 'ChartIQ'
      fin.desktop.System.getAllApplications(apps => {
        const chartIqApp = apps.find((app: any) => {
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
          logger.info(`${uuid} has subscribed as a limit checker`)
          // There will only be one. If there are more, last subscriber will be used
          this.limitCheckSubscriber = uuid
        }
      })
      fin.desktop.InterApplicationBus.addUnsubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          logger.info(`${uuid} has unsubscribed as a limit checker`)
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
  refreshCurrencyChart(symbol: string) {
    const interval = 5
    fin.desktop.InterApplicationBus.publish('chartiq:main:change_symbol', {
      symbol,
      interval,
    })
    return Promise.resolve(symbol)
  }

  /**
   * @param symbol
   * @returns {Promise<T>|Promise}
   * @private
   */
  launchCurrencyChart(symbol: string) {
    return new Promise<string>((resolve, reject) => {
      const interval = 5
      const chartIqAppId = 'ChartIQ'
      const url = `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/chartiq-shim.html?symbol=${symbol}&period=${interval}`
      const name = `chartiq_${new Date().getTime()}`
      const icon = 'http://adaptiveconsulting.github.io/chartiq/icon.png'
      const app: fin.OpenFinApplication = new fin.desktop.Application(
        {
          url,
          name,
          uuid: chartIqAppId,
          mainWindowOptions: {
            icon,
            autoShow: false,
          },
        },
        () => app.run(() => setTimeout(() => resolve(symbol), 1000), err => reject(err)),
        err => reject(err),
      )
    })
  }

  openTradeNotification = (tradeNotification: any) =>
    new fin.desktop.Notification({
      url: '/notification',
      message: tradeNotification,
      duration: 20000,
    })

  publishCurrentPositions(ccyPairPositions: any) {
    if (!this.isPresent) {
      return
    }

    fin.desktop.InterApplicationBus.publish('position-update', ccyPairPositions)
  }

  publishPrice(price: any) {
    fin.desktop.InterApplicationBus.publish('price-update', price)
  }

  sendAllBlotterData(parsed: any) {
    fin.desktop.InterApplicationBus.publish('blotter-data', parsed)
  }

  sendPositionClosedNotification(uuid: string, correlationId: string) {
    if (!this.isPresent) {
      return
    }
    fin.desktop.InterApplicationBus.send(uuid, 'position-closed', correlationId)
  }

  open(url: string) {
    fin.desktop.System.openUrlWithBrowser(url)
  }
}
