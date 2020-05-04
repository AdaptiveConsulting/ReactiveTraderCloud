/* eslint-disable no-undef */
import { Observable } from 'rxjs'
import { LimitChecker } from '../../limitChecker'
import * as finsembleRouter from './finsembleRouter'
const LOG_NAME = 'Finsemble: '

const REQUEST_LIMIT_CHECK_CHANNEL = 'request-limit-check'
const LIMIT_CHECKER_UUID = 'LIMIT-CHECKER'
const LIMIT_CHECKER_STATUS_CHANNEL = 'request-limit-check-status'
export class FinsembleLimitChecker implements LimitChecker {
  private limitCheckSubscriber: string | null = null

  constructor() {
    this.setLimitCheckSubscriber = this.setLimitCheckSubscriber.bind(this)
    this.initializeLimitChecker()
  }

  rpc(message: object) {
    return new Observable<boolean>(observer => {
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

      finsembleRouter.query(REQUEST_LIMIT_CHECK_CHANNEL, message, function(error: JSON, response: JSON) {
        if (!error) {
          const result = JSON.parse(JSON.stringify(response)) as boolean
          console.log(`Responder A Query Response Response: ${result}`);
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
    finsembleRouter.listen(LIMIT_CHECKER_STATUS_CHANNEL, function(error: JSON, response: JSON) {
      if (error) {
        console.log(`Channel Error: ${JSON.stringify(error)}`);
      } else {
        const message = JSON.stringify(response)
        console.log(`Channel Response: ${message}`);
        if (message === 'ALIVE') {
          this.setLimitCheckSubscriber(LIMIT_CHECKER_UUID, REQUEST_LIMIT_CHECK_CHANNEL)
        }
      }      
    })
  }

  private setLimitCheckSubscriber(uuid: string, topic: string) {
    if (topic === REQUEST_LIMIT_CHECK_CHANNEL) {
      console.info(LOG_NAME, `${uuid} has subscribed as a limit checker`)
      // There will only be one. If there are more, last subscriber will be used
      this.limitCheckSubscriber = uuid
    }
  }
}
