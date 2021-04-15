import styled from "styled-components"
import { OverlayDiv } from "@/components/OverlayDiv"
import { CenteringContainer } from "@/components/CenteringContainer"
import { useTileCurrencyPair } from "../Tile.context"
import {
  useRfqState,
  useIsRfq,
  onQuoteRequest,
  onCancelRfq,
  QuoteStateStage,
} from "./Rfq.state"
import { AnalyticsPricesFirstCol } from "../Tile.styles"
import { TileStates, useTileState } from "../Tile.state"
import { useIsNotionalValid } from "../Notional/Notional"

const RFQButtonInner = styled.button<{
  textWrap: boolean
  isAnalytics: boolean
}>`
  background-color: ${({ theme }) => theme.accents.primary.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  padding: 8px 10px;
  width: ${({ isAnalytics }) => (isAnalytics ? "82px" : "64px")};
  max-height: ${({ textWrap }) => (textWrap ? "48px" : "32px")};
  border-radius: 3px;
  font-weight: 300;
  font-stretch: normal;
  color: ${({ theme }) => theme.white};
  &:disabled {
    background-color: ${({ theme }) => theme.accents.primary.darker};
    cursor: default;
  }
`

const buttonState = (quoteState: QuoteStateStage, isAnalytics: boolean) => {
  switch (quoteState) {
    case QuoteStateStage.Init:
      return {
        buttonText: "Initiate RFQ",
        buttonClickHandler: onQuoteRequest,
        textWrap: !isAnalytics,
      }
    case QuoteStateStage.Requested:
      return {
        buttonText: "Cancel RFQ",
        buttonClickHandler: onCancelRfq,
        textWrap: !isAnalytics,
      }
    default:
      return {
        buttonText: "Requote",
        buttonClickHandler: onQuoteRequest,
        textWrap: false,
      }
  }
}

const RfqButton: React.FC<{ isAnalytics: boolean }> = ({ isAnalytics }) => {
  const isRfq = useIsRfq()
  const { stage } = useRfqState()
  const { symbol } = useTileCurrencyPair()
  const { buttonText, buttonClickHandler, textWrap } = buttonState(
    stage,
    isAnalytics,
  )
  const isExecuting = useTileState(symbol).status === TileStates.Started
  const validNotional = useIsNotionalValid()
  return isRfq && stage !== QuoteStateStage.Received && !isExecuting ? (
    <OverlayDiv left={isAnalytics ? `calc(${AnalyticsPricesFirstCol} / 2)` : 0}>
      <CenteringContainer>
        <RFQButtonInner
          disabled={!validNotional}
          data-testid="rfqButton"
          textWrap={textWrap}
          isAnalytics={isAnalytics}
          onClick={() => {
            if (validNotional) {
              buttonClickHandler(symbol)
            }
          }}
        >
          {buttonText}
        </RFQButtonInner>
      </CenteringContainer>
    </OverlayDiv>
  ) : null
}

export { RfqButton }
