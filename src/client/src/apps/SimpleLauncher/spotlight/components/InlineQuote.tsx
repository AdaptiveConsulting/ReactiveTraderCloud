import React, { FC } from 'react'
import { InlineIntent } from './styles'
import { DateTime } from 'luxon'
import { ResultsTable, ResultsTableRow, LoadingRow } from './resultsTable'
import { MovementIcon } from '../../icons'
import { defaultColDefs } from './utils'
import { showCurrencyPair } from 'rt-interop/intents'
import { usePlatform } from 'rt-platforms'
import { useSpotPrice } from './useSpotPrice'
interface InlineQuoteProps {
  currencyPair: string
}

export const InlineQuote: FC<InlineQuoteProps> = ({ currencyPair }) => {
  const quote = useSpotPrice(currencyPair)
  const platform = usePlatform()

  const row =
    quote && quote.symbol
      ? [
          {
            ...quote,
            priceMovementType: <MovementIcon direction={quote.priceMovementType} />,
            valueDate: DateTime.fromISO(quote.valueDate).toFormat('dd-LLL-yyyy / HH:mm:ss'),
            openTileBtn: (
              <button onClick={() => showCurrencyPair(quote.symbol, platform)}>Open Tile</button>
            ),
          },
        ]
      : []

  if (!quote) {
    return <LoadingRow cols={defaultColDefs} />
  }

  if (quote && quote?.symbol) {
    return <ResultsTableRow row={row[0]} cols={defaultColDefs} />
  }

  return null
}

export const InlineQuoteTable: FC<InlineQuoteProps> = ({ currencyPair }) => {
  return (
    <InlineIntent>
      <ResultsTable cols={defaultColDefs}>
        <InlineQuote currencyPair={currencyPair} />
      </ResultsTable>
    </InlineIntent>
  )
}
