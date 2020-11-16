import React, { FC, useMemo } from 'react'
import { InlineIntent, LoadingWrapper } from './styles'
import { useMarketService } from './useMarketService'
import { AdaptiveLoader } from 'rt-components'
import { InlineQuote } from './InlineQuote'
import { ResultsTable } from './resultsTable'
import { defaultColDefs } from './utils'

export const InlineMarketResults: FC = () => {
  const currencyPairs = useMarketService()
  const rows = useMemo(() => {
    return currencyPairs && Object.keys(currencyPairs).map(key => key)
  }, [currencyPairs])

  if (!rows) {
    return (
      <LoadingWrapper>
        <AdaptiveLoader size={25} speed={1.4} />
      </LoadingWrapper>
    )
  }

  return (
    <InlineIntent>
      <ResultsTable cols={defaultColDefs}>
        {rows.map(currencyPair => (
          <InlineQuote currencyPair={currencyPair} />
        ))}
      </ResultsTable>
    </InlineIntent>
  )
}
