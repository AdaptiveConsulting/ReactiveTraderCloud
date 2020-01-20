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
  isAnalyticView: boolean
}

const TileBookingSwitch: FC<Props> = ({
  isTradeExecutionInFlight,
  rfqState,
  notional,
  currencyPair,
  hasUserError,
  rfq,
  isAnalyticView,
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
        isAnalyticView={isAnalyticView}
      >
        Executing
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateCanRequest}
        color="blue"
        showLoader={false}
        onBookingPillClick={() => rfq.request({ notional, currencyPair })}
        disabled={hasUserError}
        isAnalyticView={isAnalyticView}
      >
        Initiate RFQ
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateExpired}
        color="blue"
        showLoader={false}
        onBookingPillClick={() => rfq.requote({ notional, currencyPair })}
        isAnalyticView={isAnalyticView}
      >
        Requote
      </TileBooking>
      <TileBooking
        show={isRfqStateRequested}
        color="red"
        showLoader={false}
        onBookingPillClick={() => rfq.cancel({ currencyPair })}
        isAnalyticView={isAnalyticView}
      >
        Cancel RFQ
      </TileBooking>
    </>
  )
}

export default TileBookingSwitch
