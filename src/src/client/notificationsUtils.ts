import { QuoteBody } from "../generated/TradingGateway"
import { QuoteDetails, RfqDetails } from "../services/credit"
import { ExecutionStatus, ExecutionTrade } from "../services/executions"
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

export const processCreditAccepted = (rfq: RfqDetails, quote: QuoteBody) => {
  const dealer = rfq.dealers.find((dealer) => dealer.id === quote.dealerId)
  return {
    title: `Quote Accepted: RFQ ID ${quote.rfqId} from ${dealer?.name}`,
    tradeDetails: `${rfq.instrument?.name} ${formatNumber(
      rfq.quantity,
    )} @ $${formatNumber(quote.price)}`,
  }
}

export const processCreditQuote = (quote: QuoteDetails) => {
  return {
    title: `Quote Received: RFQ ID ${quote.rfqId} from ${quote.dealer?.name}`,
    tradeDetails: `${quote.instrument?.name} ${formatNumber(
      quote.quantity,
    )} @ $${formatNumber(quote.price)}`,
  }
}
