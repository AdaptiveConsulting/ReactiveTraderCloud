import React, { useCallback } from 'react'
import { platformHasFeature, usePlatform } from 'rt-platforms'
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

const TileHeader: React.FC<Props> = ({ ccyPair, date, displayCurrencyChart }) => {
  const platform = usePlatform()

  const share = useCallback(() => {
    if (platformHasFeature(platform, 'share')) {
      platform.share(ccyPair.symbol)
    }
  }, [ccyPair.symbol, platform])

  const baseTerm = `${ccyPair.base}/${ccyPair.terms}`
  return (
    <Header>
      <TileSymbol data-qa="tile-header__tile-symbol">{baseTerm}</TileSymbol>
      {platformHasFeature(platform, 'share') && (
        <ActionButton data-qa="tile-header__share-button" onClick={share}>
          <i className="fas fa-share" />
        </ActionButton>
      )}
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </Header>
  )
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  const prevBaseTerm: string = `${prevProps.ccyPair.base}/${prevProps.ccyPair.terms}`
  const nextBaseTerm: string = `${nextProps.ccyPair.base}/${nextProps.ccyPair.terms}`
  return prevBaseTerm === nextBaseTerm && prevProps.date === nextProps.date
}

export default React.memo(TileHeader, areEqual)
