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

export const SuggestionWrapper: React.FC<{ intent: string }> = ({
  children,
  intent,
}) => {
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
          <button onClick={() => {}}>{intent}</button>
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
