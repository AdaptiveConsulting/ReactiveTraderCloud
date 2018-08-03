import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-util'
import { TileBaseStyle } from './Styled'

const TileExecutedStyle = styled(TileBaseStyle)`
  background-color: ${({ theme: { palette } }) => palette.accentGood.dark};
  color: ${({ theme: { text } }) => text.white};
  font-size: 13px;
  cursor: select;
`

const TradeSymbol = styled('div')`
  align-self: flex-start;
`

const CheckIcon = styled('i')`
  background-color: ${({ theme: { palette } }) => palette.accentGood.normal};
  border-radius: 50%;
  padding: 5px;
  margin-right: 5px;
`

const HeavyFont = styled('span')`
  font-weight: 900;
`

const HeavyItalicsFont = styled(HeavyFont)`
  font-style: italic;
`

const InverseFont = styled(HeavyFont)`
  background-color: ${({ theme: { text } }) => text.white};
  color: ${({ theme: { palette } }) => palette.accentGood.normal};
  border-radius: 2px;
  padding: 0px 1px;
`

const Button = styled('button')`
  font-family: Lato;
  border: none;
`

const PillButton = styled(Button)`
  background-color: ${({ theme: { palette } }) => palette.accentGood.normal};
  color: ${({ theme: { text } }) => text.white};
  border-radius: 17px;
  padding: 8px 10px;
  font-weight: 900;
`

interface Props {
  symbols: string
  tradeId: number
  currency: string
  rate: number
  counterCurrency: string
  date: string
}

const TileExecuted = ({ symbols, tradeId, currency, rate, counterCurrency, date }: Props) => (
  <TileExecutedStyle>
    <Flex direction="column" alignItems="center" justifyContent="space-between" height="100%">
      <TradeSymbol>
        <CheckIcon className="fas fa-check" aria-hidden="true" />
        <HeavyFont>{symbols}</HeavyFont>
      </TradeSymbol>
      <HeavyFont>Trade ID: {tradeId}</HeavyFont>
      <div>
        You bought <InverseFont>{currency}</InverseFont> at a rate of <InverseFont>{rate}</InverseFont> giving you{' '}
        <HeavyItalicsFont>{counterCurrency}</HeavyItalicsFont> settling <HeavyFont>{date}.</HeavyFont>
      </div>
      <PillButton>Close</PillButton>
    </Flex>
  </TileExecutedStyle>
)

export default TileExecuted
