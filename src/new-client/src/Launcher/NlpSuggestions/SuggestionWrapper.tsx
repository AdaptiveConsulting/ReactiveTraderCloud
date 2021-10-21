import { Subscribe } from "@react-rxjs/core"
import { Loader } from "@/components/Loader"
import {
  LogoWrapper,
  IntentWrapper,
  IntentActions,
  IntentActionWrapper,
  PlatformLogoWrapper,
  Suggestion,
  LoadingWrapper,
  InlineIntent,
} from "./styles"
import { reactiveTraderIcon } from "../icons"
import { NlpIntent, NlpIntentType } from "../services/nlpService"
import { openWindow } from "@/OpenFin/utils/window"
import { constructUrl } from "@/utils/url"

const handleIntent = (intent: NlpIntent) => {
  switch (intent.type) {
    case NlpIntentType.SpotQuote: {
      const currencyPair = intent.payload.symbol

      if (!currencyPair) {
        console.error(`No currency pair in queryResult`)
        return
      }

      const options = {
        name: currencyPair,
        url: constructUrl(`/spot/${currencyPair}`),
        width: 380,
        height: 200,
        includeInSnapshots: false,
      }

      openWindow(options)

      return
    }

    default:
      console.log("TODO")
  }
}

export const SuggestionWrapper: React.FC<{
  intent: NlpIntent
  intentButtonText: string
}> = ({ children, intent, intentButtonText }) => {
  return (
    <IntentWrapper>
      <IntentActions>
        <IntentActionWrapper>
          <LogoWrapper>
            <PlatformLogoWrapper>{reactiveTraderIcon}</PlatformLogoWrapper>
          </LogoWrapper>
          <span>Reactive Trader®</span>
        </IntentActionWrapper>
        <IntentActionWrapper>
          <button onClick={() => {}}>Launch Platform</button>
          <button onClick={() => handleIntent(intent)}>
            {intentButtonText}
          </button>
        </IntentActionWrapper>
      </IntentActions>
      <Suggestion>
        <InlineIntent>
          <Subscribe
            fallback={
              <LoadingWrapper>
                <Loader minWidth="18" />
              </LoadingWrapper>
            }
          >
            {children}
          </Subscribe>
        </InlineIntent>
      </Suggestion>
    </IntentWrapper>
  )
}
