import moment from 'moment'
import React from 'react'
import { Direction, Trade, TradeStatus } from 'rt-types'
import {
  Bottom,
  Close,
  CloseContainer,
  Meta,
  MetaContainer,
  MetaTitle,
  Notification,
  Status,
  Top,
  Traded
} from './Styled'

export interface Props {
  message: Trade
  dismissNotification: () => void
}

const TradeNotification: React.SFC<Props> = ({ message: trade, dismissNotification }) => {
  const formattedValueDate = trade
    ? moment(trade.valueDate)
        .format('DD MMM')
        .toUpperCase()
    : ''
  const tradeStatus = trade.status === TradeStatus.Done ? trade.status : 'REJECTED'
  const direction = trade.direction === Direction.Buy ? 'Bought' : 'Sold'

  return (
    <Notification>
      <Top justifyContent="space-between">
        <Traded>
          <div>{direction}</div>
          <div>{`${trade.dealtCurrency} ${trade.notional}`}</div>
          <div>{`vs ${trade.termsCurrency}`}</div>
        </Traded>

        <Status>{tradeStatus.toUpperCase()}</Status>
      </Top>
      <Bottom justifyContent="space-between">
        <MetaContainer>
          <MetaTitle>Rate</MetaTitle>
          <Meta>{trade.spotRate}</Meta>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Date</MetaTitle>
          <Meta>SP. {formattedValueDate.toString()}</Meta>
        </MetaContainer>
        <MetaContainer>
          <MetaTitle>Trade Id</MetaTitle>
          <Meta>{trade.tradeId}</Meta>
        </MetaContainer>
        <CloseContainer>
          <Close>
            <i className="fas fa-share" onClick={dismissNotification} />
          </Close>
        </CloseContainer>
      </Bottom>
    </Notification>
  )
}

export default TradeNotification
