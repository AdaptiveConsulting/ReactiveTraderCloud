import styled from "styled-components"
import { exhaustMap, filter, map, withLatestFrom } from "rxjs/operators"
import { FaCheckCircle, FaThumbsDown } from "react-icons/fa"
import { createSignal } from "@react-rxjs/utils"
import {
  Direction,
  QuoteBody,
  QuoteState,
  RfqState,
} from "@/generated/TradingGateway"
import { createCreditQuote$, useCreditRfqDetails } from "@/services/credit"
import { ThemeName } from "@/theme"
import { customNumberFormatter, invertDirection } from "@/utils"
import { isRfqTerminated, CreditRfqTimer } from "../../common"
import { price$, usePrice } from "./SellSideTradeTicketParameters"

const FooterWrapper = styled.div<{ accepted: boolean; missed: boolean }>`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.primary[3]};
  background-color: ${({ accepted, missed }) =>
    accepted
      ? "rgba(1, 195, 141, 0.1)"
      : missed
      ? "rgba(167, 39, 64, 0.15)"
      : undefined};
`

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 8px;
`

const FooterButton = styled.button`
  padding: 4px 8px;
  border-radius: 3px;
  height: 24px;
  font-size: 11px;
`

const PassButton = styled(FooterButton)<{ disabled: boolean }>`
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 3]};
  background-color: ${({ theme }) =>
    theme.primary[theme.name === ThemeName.Dark ? 2 : 3]};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const SendQuoteButton = styled(FooterButton)<{
  direction: Direction
  disabled: boolean
}>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].darker};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const TradeStatus = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  svg {
    margin-right: 8px;
  }
`
const Terminated = styled(TradeStatus)`
  justify-content: center;
  color: ${({ theme }) => theme.primary[5]};
`
const Accepted = styled(TradeStatus)`
  color: ${({ theme }) => theme.accents.positive.base};
`
const Missed = styled(TradeStatus)`
  color: ${({ theme }) =>
    theme.accents.negative[
      theme.name === ThemeName.Light ? "darker" : "medium"
    ]};
`
const TradeDetails = styled.div`
  font-size: 9px;
  font-weight: 500px;
`

const [quoteRequest$, sendQuote] =
  createSignal<{ rfqId: number; dealerId: number }>()

quoteRequest$
  .pipe(
    withLatestFrom(price$),
    filter(([, price]) => !isNaN(price.value)),
    map(([ids, price]) => ({
      ...ids,
      price: price.value,
    })),
    exhaustMap((quoteRequest) => createCreditQuote$(quoteRequest)),
  )
  .subscribe()

const formatter = customNumberFormatter()

interface SellSideTradeTicketTicketFooterProps {
  rfqId: number
  dealerId: number
  quote: QuoteBody | undefined
}

export const SellSideTradeTicketFooter = ({
  rfqId,
  dealerId,
  quote,
}: SellSideTradeTicketTicketFooterProps) => {
  const rfq = useCreditRfqDetails(rfqId)
  const price = usePrice()

  if (!rfq) {
    return <FooterWrapper accepted={false} missed={false} />
  }

  const {
    state,
    direction: clientDirection,
    quantity,
    instrument,
    creationTimestamp,
    expirySecs,
  } = rfq
  const direction = invertDirection(clientDirection)

  const disableSend = isNaN(price.value) || state !== RfqState.Open || !!quote
  const accepted =
    state === RfqState.Closed && quote?.state === QuoteState.Accepted
  const missed =
    state === RfqState.Closed && quote?.state !== QuoteState.Accepted

  return (
    <FooterWrapper accepted={accepted} missed={missed}>
      {state === RfqState.Open && (
        <>
          <PassButton
            disabled={!!quote}
            onClick={() => {
              console.log("Send message")
            }}
          >
            Pass
          </PassButton>
          <TimerWrapper>
            {state !== RfqState.Open ? null : (
              <CreditRfqTimer
                start={Number(creationTimestamp)}
                end={Number(creationTimestamp) + expirySecs * 1000}
                isSellSideView={true}
              />
            )}
          </TimerWrapper>
          <SendQuoteButton
            direction={direction}
            onClick={() => sendQuote({ rfqId, dealerId })}
            disabled={disableSend}
          >
            Send Quote
          </SendQuoteButton>
        </>
      )}
      {isRfqTerminated(state) && (
        <Terminated>
          Request {state === RfqState.Cancelled ? "Canceled" : "Expired"}
        </Terminated>
      )}
      {accepted && (
        <Accepted>
          <FaCheckCircle size={11} />
          <div>
            <div>Trade Successful</div>
            <TradeDetails>
              You {direction === Direction.Buy ? "Bought" : "Sold"}{" "}
              {formatter(quantity)} {instrument?.name ?? "Unknown Instrument"} @
              ${quote?.price}
            </TradeDetails>
          </div>
        </Accepted>
      )}
      {missed && (
        <Missed>
          <FaThumbsDown size={11} />
          Traded Away
        </Missed>
      )}
    </FooterWrapper>
  )
}
