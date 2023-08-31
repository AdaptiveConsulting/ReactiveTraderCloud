import { Subscribe } from "@react-rxjs/core"

import { Loader } from "@/client/components/Loader"
import { WithChildren } from "@/client/utils/utilityTypes"
import { NlpIntent } from "@/services/nlp"

import { appConfigs } from "../applicationConfigurations"
import { reactiveTraderFxIcon } from "../icons"
import { open } from "../tools"
import { handleIntent } from "./intents"
import {
  InlineIntent,
  IntentActions,
  IntentActionWrapper,
  IntentWrapper,
  LoadingWrapper,
  LogoWrapper,
  PlatformLogoWrapper,
  Suggestion,
} from "./styles"

export const SuggestionWrapper = ({
  children,
  intent,
  intentButtonText,
}: {
  intent: NlpIntent
  intentButtonText: string
} & WithChildren) => {
  return (
    <IntentWrapper>
      <IntentActions>
        <IntentActionWrapper>
          <LogoWrapper>
            <PlatformLogoWrapper>{reactiveTraderFxIcon}</PlatformLogoWrapper>
          </LogoWrapper>
          <span>Reactive Trader®</span>
        </IntentActionWrapper>
        <IntentActionWrapper>
          {/* TODO - Open and opened state should be a hook so opening here would set RT as opened in the launcher */}
          <button onClick={() => open(appConfigs[0])}>Launch Platform</button>
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
