/* eslint-disable no-undef */
import { Observable } from 'rxjs'
import { LimitChecker } from '../../limitChecker'
import { Finsemble } from '../finsemble'
const LOG_NAME = 'Finsemble: '

const REQUEST_LIMIT_CHECK_CHANNEL = 'request-limit-check'
const LIMIT_CHECKER_STATUS_CHANNEL = 'limit-check-status'
const CLIENT_STATUS_CHANNEL = 'client-status'

export class FinsembleLimitChecker implements LimitChecker {
  private limitCheckSubscriber: string | null = null
  private finsemble: Finsemble
  private limitCheckId: number = 1

  constructor() {
    this.finsemble = new Finsemble()
    this.setLimitCheckSubscriber = this.setLimitCheckSubscriber.bind(this)
    this.initializeLimitChecker(this.setLimitCheckSubscriber)
  }

  rpc(message: object) {
    return new Observable<boolean>(observer => {
      if (this.limitCheckSubscriber !== 'ALIVE') {
        console.info(LOG_NAME, 'client side limit check not up, will delegate to server')
        observer.next(true)
        observer.complete()
        return
      }

      console.info(LOG_NAME, `checking if limit is ok with ${this.limitCheckSubscriber}`)

      const limitCheckResponse = (result: boolean) => {
        console.info(LOG_NAME, `Limit check response was ${result}`)
        observer.next(result)
        observer.complete()
      }

      const payload = {
        ...message,
        id: this.limitCheckId++
      }

      this.finsemble.interop.query(REQUEST_LIMIT_CHECK_CHANNEL, payload, function(
        error: {},
        response: { data: { result: boolean } }
      ) {
        if (!error) {
          const result = response.data.result
          console.info(LOG_NAME, `Responder Query Response Response: ${result}`)
          limitCheckResponse(result)
        }
      })
    })
  }

  /**
   * Initialize limit checker
   * @private
   */
  private initializeLimitChecker(setLimitCheckSubscriber: Function) {
    this.finsemble.interop.publish(CLIENT_STATUS_CHANNEL, 'ALIVE')
    this.finsemble.interop.subscribe(LIMIT_CHECKER_STATUS_CHANNEL, function(
      error: {},
      response: { data: string }
    ) {
      if (error) {
        console.error(LOG_NAME, 'Finsemble Channel error: ' + JSON.stringify(error))
      } else {
        console.info(LOG_NAME, 'Finsemble Channel Response: ' + JSON.stringify(response))
        setLimitCheckSubscriber(response.data, LIMIT_CHECKER_STATUS_CHANNEL)
      }
    })
  }

  private setLimitCheckSubscriber(uuid: string, topic: string) {
    if (topic === LIMIT_CHECKER_STATUS_CHANNEL) {
      console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
      // There will only be one. If there are more, last subscriber will be used
      this.limitCheckSubscriber = uuid
    }
  }
}
