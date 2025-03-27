import { PropsWithChildren } from "react"
import styled from "styled-components"

import { Button } from "@/client/components/Button"
import { CenteringContainer } from "@/client/components/CenteringContainer"
import { OverlayDiv } from "@/client/components/OverlayDiv"

import { useIsNotionalValid } from "../Notional/Notional"
import { useTileCurrencyPair } from "../Tile.context"
import { TileStates, useTileState } from "../Tile.state"
import {
  onCancelRfq,
  onQuoteRequest,
  QuoteStateStage,
  useIsRfq,
  useRfqState,
} from "./Rfq.state"

const buttonState = (quoteState: QuoteStateStage) => {
  switch (quoteState) {
    case QuoteStateStage.Init:
      return {
        buttonText: "Initiate RFQ",
        buttonClickHandler: onQuoteRequest,
        cancellable: false,
      }
    case QuoteStateStage.Requested:
      return {
        buttonText: "Cancel RFQ",
        buttonClickHandler: onCancelRfq,
        cancellable: true,
      }
    default:
      return {
        buttonText: "Requote",
        buttonClickHandler: onQuoteRequest,
        cancellable: false,
      }
  }
}

type RFQButtonProps = {
  cancellable: boolean
  disabled: boolean
  onClick: () => void
}

const RFQButtonStyled = styled(Button)<RFQButtonProps>`
  ${({ cancellable, theme }) =>
    cancellable &&
    `
      background-color: ${theme.color["Colors/Background/bg-error-primary"]};
      &:hover {
        background-color: ${theme.color["Colors/Background/bg-error-secondary"]};
      }
  `}
`

export const RfqButtonInner = (props: PropsWithChildren<RFQButtonProps>) => {
  return (
    <OverlayDiv>
      <CenteringContainer>
        <RFQButtonStyled
          variant="brand"
          size="sm"
          data-testid="rfqButton"
          {...props}
        />
      </CenteringContainer>
    </OverlayDiv>
  )
}

const RfqButton = () => {
  const isRfq = useIsRfq()
  const { stage } = useRfqState()
  const { symbol } = useTileCurrencyPair()
  const { buttonText, buttonClickHandler, cancellable } = buttonState(stage)
  const isExecuting = useTileState(symbol).status === TileStates.Started
  const validNotional = useIsNotionalValid()

  return isRfq && stage !== QuoteStateStage.Received && !isExecuting ? (
    <RfqButtonInner
      cancellable={cancellable}
      disabled={!validNotional}
      onClick={() => {
        if (validNotional) {
          buttonClickHandler(symbol)
        }
      }}
    >
      {buttonText}
    </RfqButtonInner>
  ) : null
}

export { RfqButton }
