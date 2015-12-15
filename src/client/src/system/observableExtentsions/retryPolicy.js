class IndefiniteRetryPolicy {
    getRetryAfterMilliseconds(error : Error, retryCount : Number) : Number {
        return 0; // retry right away
    }
}
export default class RetryPolicy {
    static forever() : RetryPolicy {
        return new IndefiniteRetryPolicy ();
    }
}