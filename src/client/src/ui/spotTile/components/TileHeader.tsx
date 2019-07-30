import React, { useEffect, useState } from 'react'
import { usePlatform } from 'rt-components'
import { styled } from 'rt-theme'
import { TileHeader as Header, TileSymbol, DeliveryDate } from './styled'

interface Props {
  baseTerm: string
  date: string
  displayCurrencyChart?: () => void
}

export const CurrencyChartButton = styled('button')`
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid white;
`

const TileHeader: React.SFC<Props> = ({ baseTerm, date, displayCurrencyChart }) => {
  const platform = usePlatform()

  const [onTileSymbolClick, setOnTileSymbolClick] = useState({
    // TODO can we avoid having an additional key? We weren't sure how to do this optimization
    handler: () =>
      // @ts-ignore publishToChannel temporarily until made optional
      platform.window.publishToChannel(baseTerm),
  })

  useEffect(() => {
    setOnTileSymbolClick({
      // @ts-ignore publishToChannel temporarily until made optional
      handler: () => platform.window.publishToChannel(baseTerm),
    })
  }, [baseTerm])

  return (
    <Header>
      <TileSymbol onClick={onTileSymbolClick.handler}>{baseTerm}</TileSymbol>
      {platform.type !== 'browser' && (
        <CurrencyChartButton onClick={displayCurrencyChart}>
          <i className="fas fa-chart-bar" />
        </CurrencyChartButton>
      )}
      <DeliveryDate>{date}</DeliveryDate>
    </Header>
  )
}

export default TileHeader
