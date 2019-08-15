import React from 'react'
import { usePlatform } from 'rt-components'
import { styled } from 'rt-theme'
import { TileHeader as Header, TileSymbol, DeliveryDate } from './styled'

interface Props {
  baseTerm: string
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

const TileHeader: React.SFC<Props> = ({ baseTerm, date, displayCurrencyChart }) => {
  const platform = usePlatform()

  return (
    <Header>
      <TileSymbol>{baseTerm}</TileSymbol>
      {platform.hasFeature('chartIQ') && (
        <ActionButton onClick={displayCurrencyChart}>
          <i className="fas fa-chart-bar" />
        </ActionButton>
      )}
      {platform.hasFeature('share') && (
        <ActionButton onClick={() => platform.share('GBPUSD')}>
          <i className="fas fa-share" />
        </ActionButton>
      )}
      <DeliveryDate>{date}</DeliveryDate>
    </Header>
  )
}

export default TileHeader
