using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Transport;
using Adaptive.ReactiveTrader.Shared;
using Adaptive.ReactiveTrader.Shared.DTO;
using Adaptive.ReactiveTrader.Shared.DTO.Control;
using Adaptive.ReactiveTrader.Shared.Logging;
using IConnection = Adaptive.ReactiveTrader.Client.Domain.Transport.IConnection;

namespace Adaptive.ReactiveTrader.Client.Domain.ServiceClients
{
    internal class ControlServiceClient : ServiceClientBase, IControlServiceClient
    {
        private static readonly TimeSpan ControlConnectionTimeout = TimeSpan.FromMilliseconds(500);

        private readonly IAuthTokenProvider _authTokenProvider;
        private readonly ILog _log;

        public ControlServiceClient(IAuthTokenProvider authTokenProvider, IConnectionProvider connectionProvider, ILoggerFactory loggerFactory) : base(connectionProvider)
        {
            _authTokenProvider = authTokenProvider;
            _log = loggerFactory.Create(typeof (ControlServiceClient));
        }

        public IObservable<UnitDto> SetPriceFeedThroughput(FeedThroughputDto request)
        {
            if (string.IsNullOrWhiteSpace(_authTokenProvider.AuthToken))
                return GetExceptionForNoAuthKey<UnitDto>();

            return RequestUponConnection(conn => SetPriceFeedThroughput(conn, request), ControlConnectionTimeout);
        }

        public IObservable<FeedThroughputDto> GetPriceFeedThroughput()
        {
            return RequestUponConnection(GetPriceFeedThroughput, ControlConnectionTimeout);
        }

        public IObservable<IEnumerable<CurrencyPairStateDto>> GetCurrencyPairStates()
        {
            if (string.IsNullOrWhiteSpace(_authTokenProvider.AuthToken))
                return GetExceptionForNoAuthKey<IEnumerable<CurrencyPairStateDto>>();

            return RequestUponConnection(GetCurrencyPairStates, ControlConnectionTimeout);
        }

        public IObservable<UnitDto> SetCurrencyPairState(CurrencyPairStateDto request)
        {
            if (string.IsNullOrWhiteSpace(_authTokenProvider.AuthToken))
                return GetExceptionForNoAuthKey<UnitDto>();

            return RequestUponConnection(connection => SetCurrencyPairState(connection, request), ControlConnectionTimeout);

        }

        private IObservable<UnitDto> SetPriceFeedThroughput(IConnection connection, FeedThroughputDto request)
        {
            return Observable.FromAsync(() =>
            {
                connection.SetAuthToken(_authTokenProvider.AuthToken);
                return connection.ControlHubProxy.Invoke<UnitDto>(ServiceConstants.Server.SetPriceFeedThroughput, request);
            });
        }

        private IObservable<FeedThroughputDto> GetPriceFeedThroughput(IConnection connection)
        {
            return Observable.FromAsync(() =>
            {
                connection.SetAuthToken(_authTokenProvider.AuthToken);
                return connection.ControlHubProxy.Invoke<FeedThroughputDto>(ServiceConstants.Server.GetPriceFeedThroughput);
            });
        }

        private IObservable<IEnumerable<CurrencyPairStateDto>> GetCurrencyPairStates(IConnection connection)
        {
            return Observable.FromAsync(() =>
            {
                connection.SetAuthToken(_authTokenProvider.AuthToken);
                return connection.ControlHubProxy.Invoke<IEnumerable<CurrencyPairStateDto>>(ServiceConstants.Server.GetCurrencyPairStates);
            });
        }

        private IObservable<UnitDto> SetCurrencyPairState(IConnection connection, CurrencyPairStateDto request)
        {
            return Observable.FromAsync(() =>
            {
                connection.SetAuthToken(_authTokenProvider.AuthToken);
                return connection.ControlHubProxy.Invoke<UnitDto>(ServiceConstants.Server.SetCurrencyPairState, request);
            });
        } 

        private IObservable<T> GetExceptionForNoAuthKey<T>()
        {
            var message = string.Format("Expected auth token to be supplied. Add app setting key {0} with auth token for server.", AuthTokenProvider.AuthTokenKey);
            
            _log.Warn(message);
            return Observable.Throw<T>(new Exception(message));
        }
    }
}