import React from "react"
import styled from "styled-components/macro"
import { OverlayDiv } from "components/OverlayDiv"
import { CenteringContainer } from "components/CenteringContainer"
import { useTileCurrencyPair } from "../Tile.context"
import {
  useRfqState,
  useIsRfq,
  onQuoteRequest,
  onCancelRequest,
  QuoteState,
} from "./Rfq.state"
import { AnalyticsPricesFirstCol } from "../Tile.styles"
import { TileStates, useTileState } from "../Tile.state"

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
`

const buttonState = (quoteState: QuoteState, isAnalytics: boolean) => {
  switch (quoteState) {
    case QuoteState.Init:
      return {
        buttonText: "Initiate RFQ",
        buttonClickHandler: onQuoteRequest,
        textWrap: !isAnalytics,
      }
    case QuoteState.Requested:
      return {
        buttonText: "Cancel RFQ",
        buttonClickHandler: onCancelRequest,
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
  const { state } = useRfqState()
  const { symbol } = useTileCurrencyPair()
  const { buttonText, buttonClickHandler, textWrap } = buttonState(
    state,
    isAnalytics,
  )
  const isExecuting = useTileState(symbol).status === TileStates.Started
  return isRfq && state !== QuoteState.Received && !isExecuting ? (
    <OverlayDiv left={isAnalytics ? `calc(${AnalyticsPricesFirstCol} / 2)` : 0}>
      <CenteringContainer>
        <RFQButtonInner
          textWrap={textWrap}
          isAnalytics={isAnalytics}
          onClick={() => {
            buttonClickHandler(symbol)
          }}
        >
          {buttonText}
        </RFQButtonInner>
      </CenteringContainer>
    </OverlayDiv>
  ) : null
}

export { RfqButton }
