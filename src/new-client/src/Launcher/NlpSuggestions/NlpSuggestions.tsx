import { Subscribe } from "@react-rxjs/core"
import { Suggestion, HelpText } from "./styles"
import { NlpIntentType, useNlpIntent } from "../services/nlpService"
import { SuggestionWrapper } from "./SuggestionWrapper"
import { Quotes, AllQuotes } from "./Quotes"
import { Trades } from "./Trades"
import { TradeExecution } from "./TradeExecution"

export const NlpSuggestions: React.FC = () => {
  const intent = useNlpIntent()

  if (intent === "loading") return null

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

    case NlpIntentType.SpotQuote:
      return (
        <SuggestionWrapper intent={`Open ${intent.payload.symbol} Tile`}>
          <Quotes symbols={[intent.payload.symbol]} />
        </SuggestionWrapper>
      )

    case NlpIntentType.MarketInfo:
      return (
        <SuggestionWrapper intent="Open Lives Rates">
          <AllQuotes />
        </SuggestionWrapper>
      )

    default:
      // The only remaining type is NlpIntentType.TradeInfo
      return (
        <SuggestionWrapper intent="Open Trades">
          <Trades {...intent.payload} />
        </SuggestionWrapper>
      )
  }
}
