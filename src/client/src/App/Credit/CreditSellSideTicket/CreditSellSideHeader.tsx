import Logo from "@/components/Logo"
import { Direction, QuoteState, RfqState } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import { memo } from "react"
import styled from "styled-components"
import { CusipWithBenchmark } from "../common/CusipWithBenchmark"
import {
  DirectionContainer,
  DirectionLabel,
  InstrumentLabelContainer,
  InstrumentName,
} from "../common/RfqTicketHeader"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  color: ${({ theme }) => theme.textColor};
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
`

interface CreditSellSideHeaderProps {
  direction: Direction
  instrumentId: number
  rfqState: RfqState
  quoteState: QuoteState
}

export const CreditSellSideHeader = memo(function CreditSellSideHeader({
  direction,
  instrumentId,
  rfqState,
  quoteState,
}: CreditSellSideHeaderProps) {
  const instrument = useCreditInstrumentById(instrumentId)
  const accepted = quoteState === QuoteState.Accepted
  const terminated = rfqState !== RfqState.Open && !accepted

  return (
    <Wrapper>
      <Banner>
        <Logo withText={false} size={1} /> RFQ from Adaptive Asset Management
      </Banner>
      <DirectionContainer direction={direction} terminated={terminated}>
        {direction === Direction.Buy && (
          <DirectionLabel direction={direction} terminated={terminated}>
            <div>YOU {accepted ? "BOUGHT" : "BUY"}</div>
          </DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction} terminated={terminated}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <CusipWithBenchmark
            cusip={instrument?.cusip}
            benchmark={instrument?.benchmark}
          />
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction} terminated={terminated}>
            <div>YOU {accepted ? "SOLD" : "SELL"}</div>
          </DirectionLabel>
        )}
      </DirectionContainer>
    </Wrapper>
  )
})
