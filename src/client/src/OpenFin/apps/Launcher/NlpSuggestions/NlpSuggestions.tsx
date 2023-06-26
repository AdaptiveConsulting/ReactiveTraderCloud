import { Subscribe } from "@react-rxjs/core"

import { NlpIntent, NlpIntentType } from "../services/nlpService"
import { AllQuotes, Quotes } from "./Quotes"
import { HelpText, Suggestion } from "./styles"
import { SuggestionWrapper } from "./SuggestionWrapper"
import { TradeExecution } from "./TradeExecution"
import { Trades } from "./Trades"

export const NlpSuggestions = ({ intent }: { intent: NlpIntent | null }) => {
  if (intent === null) return <HelpText>No results</HelpText>

  switch (intent.type) {
    case NlpIntentType.TradeExecution:
      return (
        <Suggestion>
          <Subscribe fallback={null}>
            <TradeExecution />
          </Subscribe>
        </Suggestion>
      )

    case NlpIntentType.CreditRfq:
      return (
        <Suggestion>
          <Subscribe fallback={null}>{/* Credit */}</Subscribe>
        </Suggestion>
      )

    case NlpIntentType.SpotQuote:
      return (
        <SuggestionWrapper
          intent={intent}
          intentButtonText={`Open ${intent.payload.symbol} Tile`}
        >
          <Quotes symbols={[intent.payload.symbol]} />
        </SuggestionWrapper>
      )

    case NlpIntentType.MarketInfo:
      return (
        <SuggestionWrapper intent={intent} intentButtonText="Open Live Rates">
          <AllQuotes />
        </SuggestionWrapper>
      )

    default:
      // The only remaining type is NlpIntentType.TradeInfo
      return (
        <SuggestionWrapper intent={intent} intentButtonText="Open Trades">
          <Trades {...intent.payload} />
        </SuggestionWrapper>
      )
  }
}
