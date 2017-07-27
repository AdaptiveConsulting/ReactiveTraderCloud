var Rx = require('rxjs/Rx');

/**
 * Abstracts scheduling concerns to enable testing
 */
export default class SchedulerService {
  constructor() {
    this._immediate = Rx.Scheduler.asap;
    this._async = Rx.Scheduler.async;
  }

  get immediate() {
    return this._immediate;
  }

  get async() {
    return this._async;
  }
}
