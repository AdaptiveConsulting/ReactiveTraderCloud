import { Scheduler } from 'rxjs/Rx';

/**
 * Abstracts scheduling concerns to enable testing
 */
export default class SchedulerService {

  _immediate: any;
  _async: any;

  constructor() {
    this._immediate = Scheduler.asap;
    this._async = Scheduler.asap;
  }

  get immediate() {
    return this._immediate;
  }

  get async() {
    return this._async;
  }
}
