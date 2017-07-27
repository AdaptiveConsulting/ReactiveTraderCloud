import * as Rx from 'rx';

/**
 * Abstracts scheduling concerns to enable testing
 */
export default class SchedulerService {

  _immediate: any;
  _async: any;

  constructor() {
    this._immediate = Rx.Scheduler.immediate;
    this._async = Rx.Scheduler.default;
  }

  get immediate() {
    return this._immediate;
  }

  get async() {
    return this._async;
  }
}
