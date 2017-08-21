using System;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Client.Domain.Models.Pricing;

namespace Adaptive.ReactiveTrader.Client.UI.SpotTiles
{
    public static class PriceMovementExtentions
    {
        public static IObservable<PriceMovement> ToPriceMovementStream(this IObservable<IPrice> priceStream)
        {
            var notStale = priceStream.Where(price => !price.IsStale);

            return notStale
                .Zip(notStale.Skip(1), (previous, current) => current.Mid - previous.Mid)
                .Select(delta =>
                {
                    if (delta > 0)
                    {
                        return PriceMovement.Up;
                    }

                    if (delta < 0)
                    {
                        return PriceMovement.Down;
                    }

                    return PriceMovement.None;
                });
        }
    }
}