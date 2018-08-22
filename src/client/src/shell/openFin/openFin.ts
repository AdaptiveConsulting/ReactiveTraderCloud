import { logger } from 'rt-system'
import { Observable } from 'rxjs'

const log = logger.create('OpenFin')

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

  close = (currentWindow: fin.OpenFinWindow = this.currentWindow) => {
    currentWindow.close(
      true,
      () => log.info('Window closed with success.'),
      err => log.error('Failed to close window.', err)
    )
  }

  minimize = (currentWindow: fin.OpenFinWindow = this.currentWindow) => {
    currentWindow.minimize(
      () => log.info('Window minimized with success.'),
      err => log.error('Failed to minimize window.', err)
    )
  }

  maximize = (currentWindow: fin.OpenFinWindow = this.currentWindow) => {
    currentWindow.getState(state => {
      switch (state) {
        case 'maximized':
        case 'restored':
        case 'minimized':
          currentWindow.restore(
            () => currentWindow.bringToFront(() => log.info('Window brought to front.'), err => log.error(err)),
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

  bringToFront(currentWindow: fin.OpenFinWindow = this.currentWindow) {
    currentWindow.getState(state => {
      if (state === 'minimized') {
        currentWindow.restore(
          () => currentWindow.bringToFront(() => log.info('Window brought to front.'), err => log.error(err)),
          err => log.error(err)
        )
      } else {
        currentWindow.bringToFront(() => log.info('Window brought to front.'), err => log.error(err))
      }
    })
  }

  addSubscription(name: string, callback: (msg: any, uuid: any) => void) {
    if (!this.isPresent) {
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

  rpc(message: object) {
    return new Observable<boolean>(observer => {
      if (this.limitCheckSubscriber === null) {
        log.info('client side limit check not up, will delegate to to server')
        observer.next(true)
        observer.complete()
        return
      }

      log.info(`checking if limit is ok with ${this.limitCheckSubscriber}`)

      const topic = `limit-check-response (${this.limitCheckId++})`

      const limitCheckResponse = (msg: { result: boolean }) => {
        log.info(`${this.limitCheckSubscriber} limit check response was ${msg}`)
        observer.next(msg.result)
        observer.complete()
      }

      fin.desktop.InterApplicationBus.subscribe(this.limitCheckSubscriber, topic, limitCheckResponse)

      const payload = {
        ...message,
        id: this.limitCheckId,
        responseTopic: topic
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
  displayCurrencyChart(symbol) {
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
    return new Promise<string>((resolve, reject) => {
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
        () => app.run(() => setTimeout(() => resolve(symbol), 1000), err => reject(err)),
        err => reject(err)
      )
    })
  }

  openTradeNotification = tradeNotification =>
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

  publishCurrentPositions(ccyPairPositions) {
    if (!this.isPresent) {
      return
    }

    fin.desktop.InterApplicationBus.publish('position-update', ccyPairPositions)
  }

  publishPrice(price) {
    if (!this.isPresent) {
      return
    }
    fin.desktop.InterApplicationBus.publish('price-update', price)
  }

  sendAllBlotterData(parsed) {
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
