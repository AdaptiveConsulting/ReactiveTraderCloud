import { memo } from "react"
import styled from "styled-components"
import { Direction, QuoteState, RfqState } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import {
  CusipWithBenchmark,
  DirectionContainer,
  DirectionLabel,
  InstrumentLabelContainer,
  InstrumentName,
} from "../../common"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

interface SellSideTradeTicketHeaderProps {
  direction: Direction
  instrumentId: number
  rfqState: RfqState
  quoteState: QuoteState
}

export const SellSideTradeTicketHeader = memo(
  function SellSideTradeTicketHeader({
    direction,
    instrumentId,
    rfqState,
    quoteState,
  }: SellSideTradeTicketHeaderProps) {
    const instrument = useCreditInstrumentById(instrumentId)
    const accepted = quoteState === QuoteState.Accepted
    const terminated = rfqState !== RfqState.Open && !accepted
    return (
      <Wrapper>
        <DirectionContainer direction={direction} terminated={terminated}>
          {direction === Direction.Buy && (
            <DirectionLabel direction={direction} terminated={terminated}>
              <div>YOU {accepted ? "BOUGHT" : "BUY"}</div>
            </DirectionLabel>
          )}
          <InstrumentLabelContainer
            direction={direction}
            terminated={terminated}
          >
            <InstrumentName>
              {instrument?.name ?? "No name found"}
            </InstrumentName>
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
  },
)
