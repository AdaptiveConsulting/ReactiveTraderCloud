import React from 'react'
import { TileHeader as Header, TileSymbol, DeliveryDate } from './styled'
interface Props {
  baseTerm: string
  date: string
}

const TileHeader: React.SFC<Props> = ({ baseTerm, date }) => (
  <Header>
    <TileSymbol>{baseTerm}</TileSymbol>
    <DeliveryDate>{date}</DeliveryDate>
  </Header>
)

export default TileHeader
