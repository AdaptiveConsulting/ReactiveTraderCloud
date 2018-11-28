import { Observable } from 'rxjs'
const LOG_NAME = 'OpenFin: '

const REQUEST_LIMIT_CHECK_TOPIC = 'request-limit-check'

const REACTIVE_LIMIT_CHECK_UUID = 'reactive-trader-cloud-local'

export class OpenFinLimitChecker {
  private limitCheckSubscriber: string | null = null
  private limitCheckId: number = 1

  constructor() {
    if (typeof fin !== 'undefined') {
      this.connectToExistingLimitChecker()

      this.initializeLimitChecker()
    }
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
      fin.desktop.InterApplicationBus.addSubscribeListener(this.setLimitCheckSubscriber)
      fin.desktop.InterApplicationBus.addUnsubscribeListener(this.removeLimitCheckSubscriber)
    })
  }

  setLimitCheckSubscriber(uuid: string, topic: string) {
    if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
      console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
      // There will only be one. If there are more, last subscriber will be used
      this.limitCheckSubscriber = uuid
    }
  }

  removeLimitCheckSubscriber(uuid: string, topic: string) {
    if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
      console.info(LOG_NAME, `${uuid} has unsubscribed as a limit checker`)
      this.limitCheckSubscriber = null
    }
  }

  connectToExistingLimitChecker() {
    fin.desktop.System.getAllApplications(apps => {
      const isRunning = apps.find(app => app.isRunning && app.uuid === REACTIVE_LIMIT_CHECK_UUID)
      if (isRunning.isRunning) {
        //TODO find out whether there is some message back from the actual application itself
        // console.log("connectToExistingLimitChecker")
        // console.log(isRunning)
        // this.limitCheckSubscriber = isRunning.uuid;
      }
    })
  }
}
