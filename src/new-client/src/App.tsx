import { Subscribe } from "@react-rxjs/core";
import { memo, Suspense } from "react";
import "./App.css";
import {
  ALL_CURRENCIES,
  onSelectCurrency,
  subscriptions$,
  useCurrencies,
  useFilteredSymbols,
  useSelectedCurrency,
} from "./services/currencyPairs";
import {
  tilesSubscription$,
  useHistoricalPrices,
  usePrice,
} from "./services/tiles";
import { trades$, useTrades } from "./services/trades";

const TilePriceHistory: React.FC<{ symbol: string }> = ({ symbol }) => {
  const historicalPrices = useHistoricalPrices(symbol);
  return (
    <ul>
      {historicalPrices.slice(0, 10).map((price) => (
        <li key={price.creationTimestamp}>{price.mid}</li>
      ))}
    </ul>
  );
};

const TileCurrentPrice: React.FC<{ symbol: string }> = ({ symbol }) => {
  const currentPrice = usePrice(symbol);
  return <span>{currentPrice.mid}</span>;
};

const Tile: React.FC<{ symbol: string }> = memo(({ symbol }) => (
  <li key={symbol}>
    <p>Symbol: {symbol}</p>
    <div>
      <Suspense fallback={"Loading..."}>
        <TilePriceHistory symbol={symbol} />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <TileCurrentPrice symbol={symbol} />
      </Suspense>
    </div>
  </li>
));

const Tiles: React.FC = () => (
  <Subscribe source$={tilesSubscription$}>
    <ul>
      {useFilteredSymbols().map((symbol) => (
        <Tile key={symbol} symbol={symbol} />
      ))}
    </ul>
  </Subscribe>
);

const Currencies: React.FC = () => {
  const selectedCurrency = useSelectedCurrency();
  return (
    <div>
      <span
        style={{
          color: selectedCurrency === ALL_CURRENCIES ? "green" : "black",
        }}
        onClick={() => onSelectCurrency(ALL_CURRENCIES)}
      >
        All
      </span>
      {useCurrencies().map((currency) => (
        <span
          key={currency}
          style={{
            color: selectedCurrency === currency ? "green" : "black",
          }}
          onClick={() => onSelectCurrency(currency)}
        >
          {currency}
        </span>
      ))}
    </div>
  );
};

const BlotterRows: React.FC = () => (
  <ul>
    {useTrades().map((trade) => (
      <li key={trade.tradeId}>{JSON.stringify(trade)}</li>
    ))}
  </ul>
);

function App() {
  return (
    <div className="App">
      <Subscribe source$={subscriptions$} fallback={<>Loading...</>}>
        <Currencies />
        <Tiles />
      </Subscribe>
      <Subscribe source$={trades$}>
        <BlotterRows />
      </Subscribe>
    </div>
  );
}

export default App;
