import React from 'react'
import { TileHeader as Header, TileSymbol, DeliveryDate } from './styled'
import { CurrencyPair } from 'services/currencyPairs'

interface Props {
  ccyPair: CurrencyPair
  date: string
}

export const TileHeader: React.FC<Props> = ({ ccyPair, date }) => {

  const baseTerm = `${ccyPair.base}/${ccyPair.terms}`
  return (
    <Header>
      <TileSymbol data-qa="tile-header__tile-symbol">{baseTerm}</TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </Header>
  )
}
