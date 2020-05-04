/* eslint-disable no-undef */
import { Observable } from 'rxjs'
import { LimitChecker } from '../../limitChecker'
import { Finsemble } from '../finsemble'
const LOG_NAME = 'Finsemble: '

const REQUEST_LIMIT_CHECK_CHANNEL = 'request-limit-check'
const LIMIT_CHECKER_STATUS_CHANNEL = 'request-limit-check-status'
export class FinsembleLimitChecker implements LimitChecker {
  private limitCheckSubscriber: string | null = null
  private finsemble: Finsemble

  constructor() {
    this.finsemble = new Finsemble()
    this.setLimitCheckSubscriber = this.setLimitCheckSubscriber.bind(this)
    this.initializeLimitChecker()
  }

  rpc(message: object) {
    return new Observable<boolean>((observer) => {
      if (this.limitCheckSubscriber === null) {
        console.info(LOG_NAME, 'client side limit check not up, will delegate to server')
        observer.next(true)
        observer.complete()
        return
      }

      console.info(LOG_NAME, `checking if limit is ok with ${this.limitCheckSubscriber}`)

      const limitCheckResponse = (result: boolean) => {
        console.info(LOG_NAME, `${this.limitCheckSubscriber} limit check response was ${result}`)
        observer.next(result)
        observer.complete()
      }

      this.finsemble.interop.query(REQUEST_LIMIT_CHECK_CHANNEL, message, function (
        error: JSON,
        response: JSON,
      ) {
        if (!error) {
          const result = JSON.parse(JSON.stringify(response)) as boolean
          console.log(`Responder A Query Response Response: ${result}`)
          limitCheckResponse(result)
        }
      })
    })
  }

  /**
   * Initialize limit checker
   * @private
   */
  private initializeLimitChecker() {
    this.finsemble.interop
      .subscribe$(LIMIT_CHECKER_STATUS_CHANNEL)
      .subscribe((next) =>
        this.setLimitCheckSubscriber(JSON.stringify(next), LIMIT_CHECKER_STATUS_CHANNEL),
      )
  }

  private setLimitCheckSubscriber(uuid: string, topic: string) {
    if (topic === REQUEST_LIMIT_CHECK_CHANNEL) {
      console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
      // There will only be one. If there are more, last subscriber will be used
      this.limitCheckSubscriber = uuid
    }
  }
}
