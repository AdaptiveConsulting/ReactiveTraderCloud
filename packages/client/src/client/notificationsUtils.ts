import {
  ConfirmCreatedCreditRfq,
  PricedQuoteDetails,
  RfqDetails,
} from "@/services/credit"
import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { PricedQuoteBody } from "@/services/rfqs/types"

import { formatNumber } from "./utils"

export const processFxExecution = (executionTrade: ExecutionTrade) => {
  const status =
    executionTrade.status === ExecutionStatus.Done ? "Accepted" : "Rejected"
  const baseCurrency = executionTrade.currencyPair.substring(0, 3)
  const quoteCurrency = executionTrade.currencyPair.substring(3)

  return {
    status,
    title: `Trade ${status}: ID ${executionTrade.tradeId}`,
    tradeDetails: `${baseCurrency} ${formatNumber(
      executionTrade.notional,
    )} vs ${quoteCurrency} @ ${executionTrade.spotRate}`,
  }
}

export const processCreditRfqCreatedConfirmation = ({
  request,
  rfqId,
}: ConfirmCreatedCreditRfq) => {
  return {
    title: `RFQ Created: RFQ ID ${rfqId}`,
    rfqDetails: `RFQ for ${formatNumber(request.quantity)} ${
      request.instrument?.name
    } to ${request.dealerIds.length} dealers`,
  }
}

export const processCreditQuoteReceived = (quote: PricedQuoteDetails) => {
  return {
    title: `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`,
    quoteDetails: `${quote.instrument?.name} ${formatNumber(
      quote.quantity,
    )} @ $${formatNumber(quote.state.payload)}`,
  }
}

export const processCreditRfqWithAcceptedQuote = (
  rfq: RfqDetails,
  quote: PricedQuoteBody,
) => {
  const dealer = rfq.dealers.find((dealer) => dealer.id === quote.dealerId)
  return {
    title: `Quote Accepted: RFQ ID ${quote.rfqId} from ${dealer?.name}`,
    tradeDetails: `${rfq.instrument?.name} ${formatNumber(
      rfq.quantity,
    )} @ $${formatNumber(quote.state.payload)}`,
  }
}
