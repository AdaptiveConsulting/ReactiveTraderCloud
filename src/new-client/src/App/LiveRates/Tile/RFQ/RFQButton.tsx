import React from "react"
import styled from "styled-components/macro"
import { OverlayDiv } from "components/OverlayDiv"
import { CenteringContainer } from "components/CenteringContainer"
import { QuoteState } from "services/rfqs"
import { useTileCurrencyPair } from "../Tile.context"
import { useRfqState, onRfqButtonClick, useIsRfq } from "./Rfq.state"

const RFQButtonInner = styled("button")`
  background-color: ${({ theme }) => theme.accents.primary.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  padding: 1rem 2rem;
  width: 64px;
  height: 48px;
  border-radius: 3px;
  font-weight: 300;
  font-stretch: normal;
  color: ${({ theme }) => theme.white};
`

const buttonText = (quoteState: QuoteState | undefined) => {
  switch (quoteState) {
    case undefined:
      return "Initiate RFQ"
    case QuoteState.Requested:
      return "Cancel"
    default:
      return "Requote"
  }
}

const RfqButton: React.FC = () => {
  const isRfq = useIsRfq()
  const quoteState = useRfqState()?.quoteState
  const symbol = useTileCurrencyPair().symbol
  return isRfq && quoteState !== QuoteState.Received ? (
    <CenteringContainer>
      <RFQButtonInner
        onClick={() => {
          onRfqButtonClick(symbol)
        }}
      >
        {buttonText(quoteState)}
      </RFQButtonInner>
    </CenteringContainer>
  ) : null
}

export { RfqButton }
