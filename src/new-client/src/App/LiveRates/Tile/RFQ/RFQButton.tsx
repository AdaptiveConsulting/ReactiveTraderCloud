import React from "react"
import styled from "styled-components/macro"
import { map } from "rxjs/operators"
import { bind, Subscribe } from "@react-rxjs/core"
import { OverlayDiv } from "components/OverlayDiv"
import { CenteringContainer } from "components/CenteringContainer"
import { useTileCurrencyPair } from "../Tile.context"
import { getNotional$, onRfqButtonClick, useRfqState } from "../Tile.state"
import { QuoteStatus } from "services/rfqs"

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

const [useIsRFQ, isRFQ$] = bind((symbol: string) =>
  getNotional$(symbol).pipe(
    map((newNotional) => parseFloat(newNotional) >= 10_000_000),
  ),
)

const RFQButton: React.FC<{ symbol: string }> = ({ symbol }) => {
  const isRFQ = useIsRFQ(symbol)
  const rfqState = useRfqState(symbol)
  console.log({
    rfqState,
  })
  return isRFQ && rfqState !== QuoteStatus.Received ? (
    <OverlayDiv>
      <CenteringContainer>
        <RFQButtonInner onClick={() => onRfqButtonClick(symbol)}>
          {!rfqState
            ? "Initiate RFQ"
            : rfqState === QuoteStatus.Requested
            ? "Cancel"
            : "Requote"}
        </RFQButtonInner>
      </CenteringContainer>
    </OverlayDiv>
  ) : null
}

const RFQButtonWrapper: React.FC = () => {
  const { symbol } = useTileCurrencyPair()
  return (
    <Subscribe source$={isRFQ$(symbol)}>
      <RFQButton symbol={symbol} />
    </Subscribe>
  )
}

export { RFQButtonWrapper as RFQButton }
