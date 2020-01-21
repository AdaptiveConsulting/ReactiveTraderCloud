import React, { FC } from 'react'
import { TileBooking } from '../notifications'
import { CurrencyPair } from 'rt-types'
import { RfqActions, RfqState } from '../types'
import { getConstsFromRfqState } from '../../model/spotTileUtils'

interface Props {
  isTradeExecutionInFlight: boolean
  currencyPair: CurrencyPair
  notional: number
  rfq: RfqActions
  rfqState: RfqState
  hasUserError: boolean
  isAnalyticsView: boolean
}

const TileBookingSwitch: FC<Props> = ({
  isTradeExecutionInFlight,
  rfqState,
  notional,
  currencyPair,
  hasUserError,
  rfq,
  isAnalyticsView,
}) => {
  const { isRfqStateExpired, isRfqStateCanRequest, isRfqStateRequested } = getConstsFromRfqState(
    rfqState,
  )

  return (
    <>
      <TileBooking
        show={isTradeExecutionInFlight}
        color="blue"
        showLoader
        isAnalyticsView={isAnalyticsView}
      >
        Executing
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateCanRequest}
        color="blue"
        showLoader={false}
        onBookingPillClick={() => rfq.request({ notional, currencyPair })}
        disabled={hasUserError}
        isAnalyticsView={isAnalyticsView}
      >
        Initiate RFQ
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateExpired}
        color="blue"
        showLoader={false}
        onBookingPillClick={() => rfq.requote({ notional, currencyPair })}
        isAnalyticsView={isAnalyticsView}
      >
        Requote
      </TileBooking>
      <TileBooking
        show={isRfqStateRequested}
        color="red"
        showLoader={false}
        onBookingPillClick={() => rfq.cancel({ currencyPair })}
        isAnalyticsView={isAnalyticsView}
      >
        Cancel RFQ
      </TileBooking>
    </>
  )
}

export default TileBookingSwitch
