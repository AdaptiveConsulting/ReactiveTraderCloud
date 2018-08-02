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

const PillButton = styled('button')`
  background-color: ${({ theme: { palette } }) => palette.accentGood.normal};
  border-radius: 17px;
  padding: 8px 10px;
  border: none;
  color: ${({ theme: { text } }) => text.white};
`

const TileExecuted = () => (
  <TileExecutedStyle>
    <Flex direction="column" alignItems="center" justifyContent="space-between" height="100%">
      <TradeSymbol>
        <CheckIcon className="fas fa-check" aria-hidden="true" />
        <HeavyFont>USD/JPY</HeavyFont>
      </TradeSymbol>
      <HeavyFont>Trade ID: 2307</HeavyFont>
      <div>
        You bought <InverseFont>USD 1,000,000</InverseFont> at a rate of <InverseFont>121.577</InverseFont> giving you{' '}
        <HeavyItalicsFont>JPY 1,215,770</HeavyItalicsFont> settling <HeavyFont>(Spt) 30 Jul.</HeavyFont>
      </div>
      <PillButton>Close</PillButton>
    </Flex>
  </TileExecutedStyle>
)

export default TileExecuted
