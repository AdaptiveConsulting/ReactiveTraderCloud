import styled from "styled-components"

import { CenteringContainer } from "@/client/components/CenteringContainer"
import { OverlayDiv } from "@/client/components/OverlayDiv"

import { useIsNotionalValid } from "../Notional/Notional"
import { useTileCurrencyPair } from "../Tile.context"
import { TileStates, useTileState } from "../Tile.state"
import { AnalyticsPricesFirstCol } from "../Tile.styles"
import {
  onCancelRfq,
  onQuoteRequest,
  QuoteStateStage,
  useIsRfq,
  useRfqState,
} from "./Rfq.state"

const RfqButtonContainer = styled(OverlayDiv)`
  position: absolute;
`
const RFQButtonComponent = styled.button<{
  textWrap: boolean
  isAnalytics: boolean
}>`
  background-color: ${({ theme }) =>
    theme.newTheme.color[
      "Component colors/Components/Buttons/Brand/button-brand-bg"
    ]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  padding: 7px 10px;
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

type RFQButtonProps = {
  isAnalytics: boolean
  disabled: boolean
  textWrap: boolean
  onClick: () => void
  buttonText: string
}

export const RfqButtonInner = ({
  isAnalytics,
  disabled,
  textWrap,
  onClick,
  buttonText,
}: RFQButtonProps) => {
  return (
    <RfqButtonContainer
      left={isAnalytics ? `calc(${AnalyticsPricesFirstCol} / 2)` : 0}
    >
      <CenteringContainer>
        <RFQButtonComponent
          disabled={disabled}
          data-testid="rfqButton"
          textWrap={textWrap}
          isAnalytics={isAnalytics}
          onClick={onClick}
        >
          {buttonText}
        </RFQButtonComponent>
      </CenteringContainer>
    </RfqButtonContainer>
  )
}

const RfqButton = ({ isAnalytics }: { isAnalytics: boolean }) => {
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
    <RfqButtonInner
      isAnalytics={isAnalytics}
      disabled={!validNotional}
      textWrap={textWrap}
      onClick={() => {
        if (validNotional) {
          buttonClickHandler(symbol)
        }
      }}
      buttonText={buttonText}
    />
  ) : null
}

export { RfqButton }
