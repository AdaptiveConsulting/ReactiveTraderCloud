import { Observable } from 'rxjs'

const LOG_NAME = 'OpenFin: '

const REQUEST_LIMIT_CHECK_TOPIC = 'request-limit-check'

export class OpenFinLimitChecker {
  private limitCheckSubscriber: string | null = null
  private limitCheckId: number = 1

  constructor() {
    this.initializeLimitChecker()
  }

  rpc(message: object) {
    return new Observable<boolean>(observer => {
      if (this.limitCheckSubscriber === null) {
        console.info(LOG_NAME, 'client side limit check not up, will delegate to to server')
        observer.next(true)
        observer.complete()
        return
      }

      console.info(LOG_NAME, `checking if limit is ok with ${this.limitCheckSubscriber}`)

      const topic = `limit-check-response (${this.limitCheckId++})`

      const limitCheckResponse = (msg: { result: boolean }) => {
        console.info(LOG_NAME, `${this.limitCheckSubscriber} limit check response was ${msg}`)
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

  /**
   * Initialize limit checker
   * @private
   */
  initializeLimitChecker() {
    fin.desktop.main(() => {
      fin.desktop.InterApplicationBus.addSubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
          // There will only be one. If there are more, last subscriber will be used
          this.limitCheckSubscriber = uuid
        }
      })
      fin.desktop.InterApplicationBus.addUnsubscribeListener((uuid, topic) => {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          console.info(LOG_NAME, `${uuid} has unsubscribed as a limit checker`)
          this.limitCheckSubscriber = null
        }
      })
    })
  }
}
