import React from 'react'
import styled from 'styled-components/macro'
import { Button, Icon, TileBaseStyle } from '../styled'

export enum NotificationType {
  Error = 'negative',
  Success = 'positive',
  Warning = 'aware',
}

type AccentColor = NotificationType.Error | NotificationType.Success | NotificationType.Warning

export const TileNotificationStyle = styled(TileBaseStyle)<{ accentColor: AccentColor }>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme, accentColor }) => theme.accents[accentColor].darker};
  font-size: 0.8125rem;
  text-align: center;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  z-index: 3;
`

const TradeSymbol = styled.div`
  align-self: flex-start;

  i {
    margin-right: 0.3125rem;
  }
`

const CheckIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.accents.positive.base};
  border-radius: 50%;
  padding: 0.3125rem;
`

const HeavyFont = styled('span')`
  font-weight: 900;
`

const PillButton = styled(Button)<{ accentColor: AccentColor }>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme, accentColor }) => theme.accents[accentColor].base};
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
  symbols: string
  children: React.ReactNode
  tradeId?: number
  handleClick?: () => void
  type: NotificationType
}

const TileNotification: React.FC<Props> = ({
  style,
  symbols,
  tradeId,
  handleClick,
  children,
  type,
}) => {
  return (
    <TileNotificationStyle
      accentColor={type}
      style={style}
      data-qa="tile-notification__trade-notification"
    >
      <TradeSymbol>
        {type === NotificationType.Success ? (
          <CheckIcon
            className="fas fa-check"
            aria-hidden="true"
            data-qa="tile-notification__check-icon"
          />
        ) : (
          <Icon
            color="white"
            className="fas fa-lg fa-exclamation-triangle"
            aria-hidden="true"
            data-qa="tile-notification__warning-icon"
          />
        )}
        <HeavyFont data-qa="tile-notification__symbols">{symbols}</HeavyFont>
      </TradeSymbol>
      {tradeId && <HeavyFont data-qa="tile-notification__tradeid">Trade ID: {tradeId}</HeavyFont>}
      <Content data-qa="tile-notification__content">{children}</Content>
      {(handleClick && (
        <PillButton
          accentColor={type}
          onClick={handleClick}
          data-qa="tile-notification__pill-button"
        >
          Close
        </PillButton>
      )) || <div />}
    </TileNotificationStyle>
  )
}

export default TileNotification
