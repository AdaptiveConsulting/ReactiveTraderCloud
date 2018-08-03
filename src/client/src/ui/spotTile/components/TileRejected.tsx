import React from 'react'
import TileNotification from './TileNotification'

interface Props {
  dealtCurrency: string
  counterCurrency: string
  tradeId: number
  onNotificationDismissedClick: () => void
}

const TileRejected = ({ onNotificationDismissedClick, tradeId, dealtCurrency, counterCurrency }: Props) => (
  <TileNotification
    colors={{ bg: 'accentBad', color: 'white' }}
    icon="warning"
    symbols={`${dealtCurrency}/${counterCurrency}`}
    tradeId={tradeId}
    handleClick={onNotificationDismissedClick}
  >
    Your trade has been rejected
  </TileNotification>
)

export default TileRejected
