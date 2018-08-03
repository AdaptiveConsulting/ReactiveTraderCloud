import React from 'react'
import TileNotification from './TileNotification'

interface Props {
  dealtCurrency: string
  counterCurrency: string
  tradeId: number
}

const TileRejected = ({ tradeId, dealtCurrency, counterCurrency }: Props) => (
  <TileNotification
    colors={{ bg: 'accentBad', color: 'white' }}
    icon="warning"
    symbols={`${dealtCurrency}/${counterCurrency}`}
    tradeId={tradeId}
    handleClick={() => {}}
  >
    Your trade has been rejected
  </TileNotification>
)

export default TileRejected
