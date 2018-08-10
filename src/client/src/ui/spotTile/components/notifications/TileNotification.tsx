import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-util'
import { Button, ColorProps, Icon, TileBaseStyle } from '../Styled'

export const TileNotificationStyle = styled(TileBaseStyle)<ColorProps>`
  color: ${({ theme: { text } }) => text.white};
  background-color: ${({ theme: { palette }, backgroundColor }) => backgroundColor && palette[backgroundColor].dark};
  font-size: 0.8125rem;
  text-align: center;
  line-height: 1.5;
`

const TradeSymbol = styled('div')`
  align-self: flex-start;

  i {
    margin-right: 0.3125rem;
  }
`

const CheckIcon = styled(Icon)<ColorProps>`
  background-color: ${({ theme: { palette }, backgroundColor }) => backgroundColor && palette[backgroundColor].normal};
  border-radius: 50%;
  padding: 0.3125rem;
`

const HeavyFont = styled('span')`
  font-weight: 900;
`

const PillButton = styled(Button)<ColorProps>`
  color: ${({ theme: { text } }) => text.white};
  background-color: ${({ theme: { palette }, backgroundColor }) => backgroundColor && palette[backgroundColor].normal};
  border-radius: 17px;
  padding: 0.5rem 0.625rem;
  font-weight: 900;
  cursor: pointer;
`

const Content = styled('div')`
  max-width: 280px;
`

interface Props {
  style: React.CSSProperties
  isWarning: boolean
  symbols: string
  children: React.ReactNode
  tradeId?: number
  handleClick?: () => void
}

//TODO: SVG icons
const TileNotification: React.SFC<Props> = ({ style, isWarning, symbols, tradeId, handleClick, children }) => {
  const baseColor = isWarning ? 'accentBad' : 'accentGood'

  return (
    <TileNotificationStyle backgroundColor={baseColor} style={style}>
      <Flex direction="column" alignItems="center" justifyContent="space-between" height="100%">
        <TradeSymbol>
          {isWarning ? (
            <Icon color="white" className="fas fa-lg fa-exclamation-triangle" aria-hidden="true" />
          ) : (
            <CheckIcon color="white" backgroundColor={baseColor} className="fas fa-check" aria-hidden="true" />
          )}
          <HeavyFont>{symbols}</HeavyFont>
        </TradeSymbol>
        {tradeId && <HeavyFont>Trade ID: {tradeId}</HeavyFont>}
        <Content>{children}</Content>
        {(handleClick && (
          <PillButton backgroundColor={baseColor} onClick={handleClick}>
            Close
          </PillButton>
        )) || <div />}
      </Flex>
    </TileNotificationStyle>
  )
}

export default TileNotification
