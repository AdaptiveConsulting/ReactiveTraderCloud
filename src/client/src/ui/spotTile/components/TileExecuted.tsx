import moment from 'moment'
import numeral from 'numeral'
import React from 'react'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'
import { styled } from 'rt-util'
import { TileBaseStyle } from './Styled'

const TileExecutedStyle = styled(TileBaseStyle)`
  background-color: ${({ theme: { palette } }) => palette.accentGood.dark};
  color: ${({ theme: { text } }) => text.white};
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
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
  dealtCurrency: string
  counterCurrency: string
  notional: number
  tradeId: number
  rate: number
  date: Date
  direction: Direction
}

const directionText = {
  [Direction.Buy]: 'bought',
  [Direction.Sell]: 'sold'
}

const TileExecuted = ({ direction, tradeId, dealtCurrency, rate, notional, counterCurrency, date }: Props) => {
  const symbols = `${dealtCurrency}/${counterCurrency}`
  const dealtText = `${dealtCurrency} ${numeral(notional).format('0,000,000[.]00')}`
  const counterText = `${counterCurrency} ${numeral(notional * rate).format('0,000,000[.]00')}`
  const formattedDate = `(Spt) ${moment(date).format('D MMM')}`
  return (
    <TileExecutedStyle>
      <Flex direction="column" alignItems="center" justifyContent="space-between" height="100%">
        <TradeSymbol>
          <CheckIcon className="fas fa-check" aria-hidden="true" />
          <HeavyFont>{symbols}</HeavyFont>
        </TradeSymbol>
        <HeavyFont>Trade ID: {tradeId}</HeavyFont>
        <div>
          You {directionText[direction]} <InverseFont>{dealtText}</InverseFont> at a rate of{' '}
          <InverseFont>{rate}</InverseFont> for <HeavyItalicsFont>{counterText}</HeavyItalicsFont> settling{'  '}
          <HeavyFont>{formattedDate}.</HeavyFont>
        </div>
        <PillButton>Close</PillButton>
      </Flex>
    </TileExecutedStyle>
  )
}

export default TileExecuted
