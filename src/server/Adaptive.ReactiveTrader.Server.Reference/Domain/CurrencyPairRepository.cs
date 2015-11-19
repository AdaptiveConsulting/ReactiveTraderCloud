using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Contract;

namespace Adaptive.ReactiveTrader.Server.ReferenceData.Domain
{
    public class CurrencyPairRepository : ICurrencyPairRepository
    {
        Subject<CurrencyPairUpdateDto> _updates = new Subject<CurrencyPairUpdateDto>();

        private readonly Dictionary<string, CurrencyPairInfo> _currencyPairs = new Dictionary<string, CurrencyPairInfo>
        {
            {"EURUSD", CreateCurrencyPairInfo("EURUSD", 4, 5, 1.3629m, true)},
            // {"EURUSD", CreateCycleCurrencyPairInfo("EURUSD", 4, 5, 1.3629m, true, 1.36m, 1.365m,"Price cycles between 1.36-1.365")},
            {"USDJPY", CreateCurrencyPairInfo("USDJPY", 2, 3, 102.14m, true)},
            {
                "GBPUSD",
                CreateCurrencyPairInfo("GBPUSD", 4, 5, 1.6395m, true,
                    "Server waits 1.5sec to execute then sends a trade done.")
            }, // ExecutionService
            {"GBPJPY", CreateCurrencyPairInfo("GBPJPY", 2, 3, 167.67m, true, "Always rejects upon execution.")},
            // ExecutionService
            {"EURGBP", CreateCurrencyPairInfo("EURGBP", 4, 5, 0.8312m, false)},
            {"USDCHF", CreateCurrencyPairInfo("USDCHF", 4, 5, 0.897m, false)},
            {
                "EURJPY",
                CreateCurrencyPairInfo("EURJPY", 2, 3, 139.22m, true,
                    "Waits 5sec before sending a trade response (times-out).")
            }, // ExecutionService
            {
                "EURCHF",
                CreateCurrencyPairInfo("EURCHF", 4, 5, 1.2224m, false,
                    "Server waits before sending a first price update.")
            }, // PricingHub
            {"AUDUSD", CreateCurrencyPairInfo("AUDUSD", 4, 5, 0.8925m, true)},
            {"NZDUSD", CreateCurrencyPairInfo("NZDUSD", 4, 5, 0.8263m, true)},
            {"EURCAD", CreateCurrencyPairInfo("EURCAD", 4, 5, 1.5062m, true)},
            {"EURAUD", CreateCurrencyPairInfo("EURAUD", 4, 5, 1.5256m, true)},
            {"AUDCAD", CreateCurrencyPairInfo("AUDCAD", 4, 5, 0.9873m, false)},
            {"GBPCHF", CreateCurrencyPairInfo("GBPCHF", 4, 5, 1.4723m, false)},
            {"CHFJPY", CreateCurrencyPairInfo("CHFJPY", 2, 3, 113.8591m, false)},
            {"AUDJPY", CreateCurrencyPairInfo("AUDJPY", 2, 3, 91.3133m, false)},
            {"AUDNZD", CreateCurrencyPairInfo("AUDNZD", 4, 5, 1.0807m, false)},
            {"CADJPY", CreateCurrencyPairInfo("CADJPY", 2, 3, 92.4686m, false)},
            {"CHFUSD", CreateCurrencyPairInfo("CHFUSD", 4, 5, 1.1148m, false)},
            {"EURNOK", CreateCurrencyPairInfo("EURNOK", 4, 4, 8.3613m, false)},
            {"EURSEK", CreateCurrencyPairInfo("EURSEK", 4, 4, 8.8505m, false)},
        };

        private static CurrencyPairInfo CreateCurrencyPairInfo(string symbol, int pipsPosition, int ratePrecision,
            decimal sampleRate, bool enabled, string comment = "")
        {
            return new RandomWalkCurrencyPairInfo(new CurrencyPairDto(symbol, ratePrecision, pipsPosition), sampleRate,
                enabled, comment);
        }

        private static CurrencyPairInfo CreateCycleCurrencyPairInfo(string symbol, int pipsPosition, int ratePrecision,
            decimal sampleRate, bool enabled, decimal min, decimal max, string comment)
        {
            return new CyclicalCurrencyPairInfo(new CurrencyPairDto(symbol, ratePrecision, pipsPosition), sampleRate,
                enabled, comment, min, max);
        }

        public IEnumerable<CurrencyPairInfo> GetAllCurrencyPairs()
        {
            return _currencyPairs.Values;
        }

        public IEnumerable<CurrencyPairInfo> GetAllCurrencyPairInfos()
        {
            return _currencyPairs.Values;
        }

        public IObservable<CurrencyPairUpdatesDto> GetCurrencyUpdateStream()
        {
            return Observable.Create<CurrencyPairUpdatesDto>(observer =>
            {
                observer.OnNext(new CurrencyPairUpdatesDto
                {
                    Updates = GetAllCurrencyPairs()
                        .Where(i => i.Enabled)
                        .Select(
                            c => new CurrencyPairUpdateDto
                            {
                                UpdateType = UpdateTypeDto.Added,
                                CurrencyPair = c.CurrencyPair
                            })
                });


                _updates.Select(u => new CurrencyPairUpdatesDto
                {
                    Updates = new[] {u}
                }).Subscribe(observer);

                return () => { };
            });
        }

        public CurrencyPairDto GetCurrencyPair(string symbol)
        {
            return _currencyPairs[symbol].CurrencyPair;
        }

        public decimal GetSampleRate(string symbol)
        {
            return _currencyPairs[symbol].SampleRate;
        }

        public bool Exists(string symbol)
        {
            return _currencyPairs.ContainsKey(symbol);
        }

        public async Task AddCurrencyPair(CurrencyPairDto currencyPair)
        {
            var update = new CurrencyPairUpdateDto
            {
                CurrencyPair = currencyPair,
                UpdateType = UpdateTypeDto.Added
            };

            _currencyPairs[currencyPair.Symbol].Enabled = true;
            _updates.OnNext(update);
        }

        public async Task RemoveCurrencyPair(CurrencyPairDto currencyPair)
        {
            var update = new CurrencyPairUpdateDto
            {
                CurrencyPair = currencyPair,
                UpdateType = UpdateTypeDto.Removed
            };

            _currencyPairs[currencyPair.Symbol].Enabled = false;
            _updates.OnNext(update);
        }
    }
}