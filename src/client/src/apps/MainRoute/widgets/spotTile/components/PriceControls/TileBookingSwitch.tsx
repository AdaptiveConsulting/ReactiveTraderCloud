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
}

const TileBookingSwitch: FC<Props> = ({
  isTradeExecutionInFlight,
  rfqState,
  notional,
  currencyPair,
  hasUserError,
  rfq,
}) => {
  const { isRfqStateExpired, isRfqStateCanRequest, isRfqStateRequested } = getConstsFromRfqState(
    rfqState,
  )

  return (
    <>
      <TileBooking show={isTradeExecutionInFlight} color="blue" showLoader>
        Executing
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateCanRequest}
        color="blue"
        onBookingPillClick={() => rfq.request({ notional, currencyPair })}
        disabled={hasUserError}
      >
        Initiate
        <br />
        RFQ
      </TileBooking>
      <TileBooking
        show={!isTradeExecutionInFlight && isRfqStateExpired}
        color="blue"
        onBookingPillClick={() => rfq.requote({ notional, currencyPair })}
      >
        Requote
      </TileBooking>
      <TileBooking
        show={isRfqStateRequested}
        color="red"
        onBookingPillClick={() => rfq.cancel({ currencyPair })}
      >
        Cancel
        <br />
        RFQ
      </TileBooking>
    </>
  )
}

export default TileBookingSwitch
