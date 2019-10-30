import React, { FC } from 'react'
import { DateTime } from 'luxon'
import { Direction, Trade, TradeStatus } from 'rt-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

import {
  Bottom,
  CloseContainer,
  Close,
  MetaContainer,
  MetaTitle,
  Notification,
  Status,
  Top,
  Traded,
} from './styled'
library.add(faShare)
export interface Props {
  trade: Trade
  dismissNotification: () => void
  highlightTradeInBlotter?: () => void
}

const TradeNotification: FC<Props> = ({ trade, dismissNotification, highlightTradeInBlotter }) => {
  const formattedValueDate = DateTime.fromJSDate(trade.valueDate)
    .toFormat('dd MMM')
    .toUpperCase()

  const isDone = trade.status === TradeStatus.Done

  const tradeStatus = isDone ? '' : 'REJECTED'
  const direction = trade.direction === Direction.Buy ? 'Bought' : 'Sold'
  return (
    <Notification onClick={highlightTradeInBlotter}>
      <Top justifyContent="space-between">
        <Traded isDone={isDone}>
          <div>{`${direction.toUpperCase()} ${trade.dealtCurrency} ${trade.notional}`}</div>
          <div>{`vs ${trade.termsCurrency}`}</div>
        </Traded>

        <Status isDone={isDone}>{tradeStatus.toUpperCase()}</Status>
      </Top>
      <Bottom justifyContent="space-between">
        <MetaContainer>
          <MetaTitle>Rate</MetaTitle>
          <div>{trade.spotRate}</div>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Date</MetaTitle>
          <div>SP. {formattedValueDate.toString()}</div>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Trade Id</MetaTitle>
          <div>{trade.tradeId}</div>
        </MetaContainer>
        <CloseContainer>
          <Close onClick={dismissNotification}>
            <FontAwesomeIcon icon="share" size="2x" />
          </Close>
        </CloseContainer>
      </Bottom>
    </Notification>
  )
}

export default TradeNotification
