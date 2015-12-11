var Rx = require('rx');

export default class SchedulerService {
    constructor() {
        this._immediate = Rx.Scheduler.immediate;
        this._timeout = Rx.Scheduler.timeout;
    }
    get immediate() {
        return this._immediate;
    }
    get timeout() {
        return this._timeout;
    }
}
