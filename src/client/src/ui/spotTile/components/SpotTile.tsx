import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import { TileBaseStyle } from './styled'

//TODO ML 07/01/2019 this should be TileWrapper and be moved to styled.tsx
export const SpotTileWrapper = styled('div')`
  position: relative;
  min-height: 10rem;
  height: 100%;
  color: ${({ theme }) => theme.tile.textColor};
`

export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.backgroundColor};
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
`
const NotionalInputWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  notional: string
  updateNotional: (notional: string) => void
  canExecute: boolean
  chartData?: []
}

export default class SpotTile extends PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price },
      notional,
      updateNotional,
      executeTrade,
      canExecute,
      children,
    } = this.props

    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    return (
      <SpotTileWrapper>
        <SpotTileStyle className="spot-tile">
          <TileHeader baseTerm={baseTerm} date={date} />
          <PriceControls
            executeTrade={executeTrade}
            priceData={price}
            currencyPair={currencyPair}
            disabled={canExecute}
          />
          <NotionalInputWrapper>
            <NotionalInput notional={notional} currencyPairSymbol={currencyPair.base} updateNotional={updateNotional} />
          </NotionalInputWrapper>
        </SpotTileStyle>
        {children}
      </SpotTileWrapper>
    )
  }
}
