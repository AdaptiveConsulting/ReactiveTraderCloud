class IndefiniteRetryPolicy {
    getRetryAfterMilliseconds(error:Error, retryCount:Number):Number {
        return 0; // retry right away
    }
}

class IndefiniteEvery2SecondsRetryPolicy {
    getRetryAfterMilliseconds(error:Error, retryCount:Number):Number {
        return 2000;
    }
}
class BackoffTo10SecondsMax {
    getRetryAfterMilliseconds(error:Error, retryCount:Number):Number {
        var retryAfter = retryCount * 1000;
        return retryAfter < 10000
            ? retryAfter
            : 10000; // retry right away
    }
}
export default class RetryPolicy {
    static forever():RetryPolicy {
        return new IndefiniteRetryPolicy();
    }

    static backoffTo10SecondsMax():RetryPolicy {
        return new BackoffTo10SecondsMax();
    }

    static indefiniteEvery2Seconds():RetryPolicy {
        return new IndefiniteEvery2SecondsRetryPolicy();
    }
}