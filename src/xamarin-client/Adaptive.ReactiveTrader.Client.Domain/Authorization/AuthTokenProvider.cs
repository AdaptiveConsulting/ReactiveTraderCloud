using Adaptive.ReactiveTrader.Shared;

namespace Adaptive.ReactiveTrader.Client.Domain.Authorization
{
    public class AuthTokenProvider : IAuthTokenProvider
    {
        public AuthTokenProvider(string authToken)
        {
            AuthToken = authToken;
        }

        public string AuthToken { get; private set; }
    }
}