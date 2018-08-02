import React from 'react'
import { styled } from 'rt-util'

const DeliveryDateStyle = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 10px;
`

interface DeliveryDateProps {
  date: string
}

export const DeliveryDate = ({ date }: DeliveryDateProps) => <DeliveryDateStyle>{`SPT (${date})`}</DeliveryDateStyle>

const TileSymbolStyle = styled('div')`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: 13px;
`

interface TileSymbolProps {
  symbol: string
}

export const TileSymbol = ({ symbol }: TileSymbolProps) => <TileSymbolStyle>{symbol}</TileSymbolStyle>
