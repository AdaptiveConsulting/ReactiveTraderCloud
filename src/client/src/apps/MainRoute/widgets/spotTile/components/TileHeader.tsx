import React, { useCallback } from 'react'
import { usePlatform } from 'rt-components'
import { styled } from 'rt-theme'
import { TileHeader as Header, TileSymbol, DeliveryDate } from './styled'
import { CurrencyPair } from 'rt-types'

interface Props {
  ccyPair: CurrencyPair
  date: string
  displayCurrencyChart?: () => void
}

export const ActionButton = styled('button')`
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid white;
`

const TileHeader: React.SFC<Props> = ({ ccyPair, date, displayCurrencyChart }) => {
  const platform = usePlatform()

  const share = useCallback(() => {
    if (platform.hasFeature('share')) {
      platform.share(ccyPair.symbol)
    }
  }, [ccyPair.symbol])

  const baseTerm = `${ccyPair.base}/${ccyPair.terms}`
  return (
    <Header>
      <TileSymbol>{baseTerm}</TileSymbol>
      {platform.hasFeature('chartIQ') && (
        <ActionButton onClick={displayCurrencyChart}>
          <i className="fas fa-chart-bar" />
        </ActionButton>
      )}
      {platform.hasFeature('share') && (
        <ActionButton onClick={share}>
          <i className="fas fa-share" />
        </ActionButton>
      )}
      <DeliveryDate>{date}</DeliveryDate>
    </Header>
  )
}

export default TileHeader
