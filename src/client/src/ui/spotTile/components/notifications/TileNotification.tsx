import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-util'
import { Button, ColorProps, Icon, TileBaseStyle } from '../Styled'

export const TileNotificationStyle = styled(TileBaseStyle)<ColorProps>`
  color: ${({ theme: { text }, color }) => text[color]};
  background-color: ${({ theme: { palette }, bg }) => palette[bg].dark};
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
  position: absolute;
  z-index: 2;
`

const TradeSymbol = styled('div')`
  align-self: flex-start;
`

const CheckIcon = styled(Icon)<ColorProps>`
  background-color: ${({ theme: { palette }, bg }) => palette[bg].normal};
  margin-right: 5px;
  border-radius: 50%;
  padding: 5px;
`

const HeavyFont = styled('span')`
  font-weight: 900;
`

const PillButton = styled(Button)<ColorProps>`
  color: ${({ theme: { text }, color }) => text[color]};
  background-color: ${({ theme: { palette }, bg }) => palette[bg].normal};
  border-radius: 17px;
  padding: 8px 10px;
  font-weight: 900;
  cursor: pointer;
`

interface Props {
  colors: ColorProps
  icon: string
  symbols: string
  children: React.ReactNode
  tradeId?: number
  handleClick?: () => void
}

const TileNotification = ({ colors, icon, symbols, tradeId, handleClick, children }: Props) => (
  <TileNotificationStyle {...colors}>
    <Flex direction="column" alignItems="center" justifyContent="space-between" height="100%">
      <TradeSymbol>
        {icon === 'check' && <CheckIcon {...colors} className="fas fa-check" aria-hidden="true" />}
        {icon === 'warning' && <Icon {...colors} className="fas fa-lg fa-exclamation-triangle" aria-hidden="true" />}
        <HeavyFont>{symbols}</HeavyFont>
      </TradeSymbol>
      {tradeId && <HeavyFont>Trade ID: {tradeId}</HeavyFont>}
      <div>{children}</div>
      {(handleClick && (
        <PillButton {...colors} onClick={handleClick}>
          Close
        </PillButton>
      )) || <div />}
    </Flex>
  </TileNotificationStyle>
)

export default TileNotification
