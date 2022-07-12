import { Direction, QuoteState } from "@/generated/TradingGateway"
import styled from "styled-components"

// Card

export const CreditRfqCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex: 1;
`

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  width: 300px;
  height: 251px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  width: 100%;
`

export const DetailsWrapper = styled(Row)`
  margin: 1px 0;
  flex: 0 0 24px;
  background: ${({ theme }) => theme.core.backgroundHoverColor};
`

export const RowText = styled.span`
  font-size: 11px;
  font-weight: 500;
`

export const Label = styled(RowText)`
  color: ${({ theme }) => theme.textColor};
`

export const Quantity = styled(RowText)`
  color: ${({ theme }) => theme.colors.light.primary[5]};
`

export const QuotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const QuoteRow = styled(Row)<{ quoteActive: boolean }>`
  justify-content: start;
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }
  &:hover {
    & button {
      display: ${({ quoteActive }) => (quoteActive ? "block" : null)};
    }
  }
`

// This color does not seem to be part of the palette
export const DealerName = styled(RowText)`
  color: #a1a5ae;
  margin-right: auto;
`

export const Price = styled(RowText)<{ quoteState?: QuoteState }>`
  color: ${({ theme, quoteState }) => {
    switch (quoteState) {
      case QuoteState.Accepted:
        return theme.accents.positive.darker
      case QuoteState.Rejected:
        return theme.accents.negative.darker
      default:
        return theme.textColor
    }
  }};
`

export const AcceptQuoteButton = styled.button`
  user-select: none;
  display: none;
  border-radius: 3px;
  padding: 0 8px;
  height: 16px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
  background-color: ${({ theme }) =>
    theme.colors.spectrum.uniqueCollections.Buy.base};
`

export const NoRfqsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Card Header

interface WithDirection {
  direction: Direction
}

export const DirectionContainer = styled.div<WithDirection>`
  display: flex;
  width: 100%;
  flex: 0 0 48px;
  align-items: center;
  background-color: ${(props) =>
    props.direction === Direction.Buy
      ? "rgba(76, 118, 196, 0.15)"
      : "rgba(167, 39, 64, 0.15)"};
`

// Not sure about the clipped path value here, atm they are eyeballed
export const DirectionLabel = styled.div<WithDirection>`
  position: relative;
  display: flex;
  justify-content: ${({ direction }) =>
    direction === Direction.Buy ? "start" : "end"};
  align-items: center;
  padding: 0 15px;
  height: 100%;
  width: 70px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.white};
  border-radius: 2px;
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].darker};
  clip-path: ${({ direction }) =>
    direction === Direction.Buy
      ? "polygon(0 0, 100% 0, 70% 100%, 0% 100%)"
      : "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)"};
  &:after {
    right: ${({ direction }) => (direction === Direction.Buy ? 0 : null)};
    left: ${({ direction }) => (direction === Direction.Sell ? 0 : null)};
    width: 14px;
    z-index: 10;
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    background-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].base};
    -moz-transform: skewX(-24deg);
    -webkit-transform: skewX(-24deg);
    -ms-transform: skewX(-24deg);
    transform: skewX(-24deg);
  }
`

export const InstrumentLabelContainer = styled.div<WithDirection>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  margin-left: ${({ direction }) =>
    direction === Direction.Sell ? "8px" : "4px"};
`

export const InstrumentName = styled.div`
  font-size: 13px;
  font-weight: 600;
`

export const InstrumentCusip = styled.div`
  font-size: 11px;
  font-weight: 500;
  opacity: 0.6;
`

// Card Footer

export const CardFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 32px;
  padding: 0 8px;
  margin-top: 1px;
  background: ${({ theme }) => theme.core.lightBackground};
`

export const CancelQuoteButton = styled.button`
  background-color: ${({ theme }) => `${theme.core.darkBackground}`};
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 5px 3px 5px;
  margin-left: 9px;
`

export const CardState = styled.div<{ accepted: boolean }>`
  justify-self: end;
  color: ${({ theme, accepted }) =>
    accepted
      ? theme.colors.accents.positive.darker
      : theme.colors.accents.negative.darker};
  text-transform: uppercase;
  font-size: 11px;
`
