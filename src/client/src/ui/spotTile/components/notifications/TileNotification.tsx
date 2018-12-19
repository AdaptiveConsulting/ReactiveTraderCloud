import React from 'react'
import { styled } from 'rt-theme'
import { Button, Icon, TileBaseStyle } from '../styled'

type AccentColor = 'red' | 'green'

export const TileNotificationStyle = styled(TileBaseStyle)<{ accentColor: AccentColor }>`
  color: ${({ theme }) => theme.template.white.normal};
  background-color: ${({ theme, accentColor }) => theme.template[accentColor].dark};
  font-size: 0.8125rem;
  text-align: center;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

const TradeSymbol = styled.div`
  align-self: flex-start;

  i {
    margin-right: 0.3125rem;
  }
`

const CheckIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.template.green.normal};
  border-radius: 50%;
  padding: 0.3125rem;
`

const HeavyFont = styled('span')`
  font-weight: 900;
`

const PillButton = styled(Button)<{ accentColor: AccentColor }>`
  color: ${({ theme }) => theme.template.white.normal};
  background-color: ${({ theme, accentColor }) => theme.template[accentColor].normal};
  border-radius: 17px;
  padding: 0.5rem 0.625rem;
  font-weight: 900;
  cursor: pointer;
`

const Content = styled.div`
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

const TileNotification: React.SFC<Props> = ({ style, isWarning, symbols, tradeId, handleClick, children }) => {
  const accentColor = isWarning ? 'red' : 'green'

  return (
    <TileNotificationStyle accentColor={accentColor} style={style}>
      <TradeSymbol>
        {isWarning ? (
          <Icon color="white" className="fas fa-lg fa-exclamation-triangle" aria-hidden="true" />
        ) : (
          <CheckIcon className="fas fa-check" aria-hidden="true" />
        )}
        <HeavyFont>{symbols}</HeavyFont>
      </TradeSymbol>
      {tradeId && <HeavyFont>Trade ID: {tradeId}</HeavyFont>}
      <Content>{children}</Content>
      {(handleClick && (
        <PillButton accentColor={accentColor} onClick={handleClick}>
          Close
        </PillButton>
      )) || <div />}
    </TileNotificationStyle>
  )
}

export default TileNotification
