using System;

namespace RxStreamingConnectionAbstraction
{
    public interface IRetryPolicy
    {
        bool ShouldRetry(Exception ex, int retryCount);
    }

    public static class RetryPolicy 
    {
        public static IRetryPolicy Forever()
        {
            return new RetryForever();
        }

        private class RetryForever : IRetryPolicy
        {
            public bool ShouldRetry(Exception ex, int retryCount)
            {
                return true;
            }
        }
    }
}