using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Client.Domain.Models;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;
using Adaptive.ReactiveTrader.Client.Domain.Models.ReferenceData;
using Adaptive.ReactiveTrader.Client.UI.SpotTiles;
using Adaptive.ReactiveTrader.Shared.DTO.Pricing;
using NUnit.Framework;

namespace Adaptive.ReactiveTrader.Tests.Client
{
    [TestFixture]
    public class PriceMovementExtentionsTests
    {
        [TestCase(1, 2, PriceMovement.Up)]
        [TestCase(2, 1, PriceMovement.Down)]
        [TestCase(1, 1, PriceMovement.None)]
        public static async Task Returns_Correct_Movement(decimal price1, decimal price2, PriceMovement expected)
        {
            var subject = new ReplaySubject<IPrice>();

            var result = subject.ToPriceMovementStream();
            subject.OnNext(new Price { Mid = price1 });
            subject.OnNext(new Price { Mid = price2 });
            subject.OnCompleted();

            // Assert
            await result.SingleAsync(movement => movement == expected);
        }
        
        class Price : IPrice
        {
            public IExecutablePrice Bid { get; set; }
            public IExecutablePrice Ask { get; set; }
            public decimal Mid { get; set; }
            public ICurrencyPair CurrencyPair { get; set; }
            public DateTime ValueDate { get; set; }
            public decimal Spread { get; set; }
            public bool IsStale { get; set; }
        }
    }
}
