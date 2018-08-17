import moment from 'moment'
import numeral from 'numeral'
import React from 'react'
import { styled } from 'rt-theme'
import { Direction } from 'rt-types'

const HeavyFont = styled('span')`
  font-weight: 900;
`

const HeavyItalicsFont = styled(HeavyFont)`
  font-style: italic;
`

const InverseFont = styled(HeavyFont)`
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.green.base};
  border-radius: 2px;
  padding: 0 0.0625rem;
`

interface Props {
  dealtCurrency: string
  counterCurrency: string
  notional: number
  rate: number
  date: Date
  direction: Direction
}

const directionText = {
  [Direction.Buy]: 'bought',
  [Direction.Sell]: 'sold'
}

const TileExecuted: React.SFC<Props> = ({ direction, dealtCurrency, rate, notional, counterCurrency, date }) => {
  const dealtText = `${dealtCurrency} ${numeral(notional).format('0,000,000[.]00')}`
  const counterText = `${counterCurrency} ${numeral(notional * rate).format('0,000,000[.]00')}`
  const formattedDate = `(Spt) ${moment(date).format('D MMM')}`
  return (
    <React.Fragment>
      You {directionText[direction]} <InverseFont>{dealtText}</InverseFont> at a rate of{' '}
      <InverseFont>{rate}</InverseFont> for <HeavyItalicsFont>{counterText}</HeavyItalicsFont> settling
      {'  '}
      <HeavyFont>{formattedDate}.</HeavyFont>
    </React.Fragment>
  )
}

export default TileExecuted
