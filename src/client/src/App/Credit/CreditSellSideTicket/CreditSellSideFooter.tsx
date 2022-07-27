import { Direction, QuoteBody, RfqState } from "@/generated/TradingGateway"
import { createCreditQuote$ } from "@/services/credit"
import { ThemeName } from "@/theme"
import { closeWindow } from "@/utils/window/closeWindow"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { exhaustMap, filter, map, withLatestFrom } from "rxjs/operators"
import styled from "styled-components"
import { price$, usePrice } from "./CreditSellSideParameters"

const FooterWrapper = styled.div`
  flex: 0 0 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
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

const [quoteRequest$, sendQuote] =
  createSignal<{ rfqId: number; dealerId: number }>()
quoteRequest$
  .pipe(
    withLatestFrom(price$),
    filter(([_, price]) => price.value > 0),
    map(([ids, price]) => ({
      ...ids,
      price: price.value,
    })),
    exhaustMap((quoteRequest) => createCreditQuote$(quoteRequest)),
  )
  .subscribe()

interface CreditSellSideTicketFooterProps {
  rfqId: number
  dealerId: number
  quote: QuoteBody | undefined
  state: RfqState
  direction: Direction
}

export const CreditSellSideFooter: FC<CreditSellSideTicketFooterProps> = ({
  rfqId,
  dealerId,
  quote,
  state,
  direction,
}) => {
  const price = usePrice()
  const disableSend = price.value <= 0 || state !== RfqState.Open || !!quote

  return (
    <FooterWrapper>
      <PassButton disabled={!!quote} onClick={closeWindow}>
        Pass
      </PassButton>
      <SendQuoteButton
        direction={direction}
        onClick={() => sendQuote({ rfqId, dealerId })}
        disabled={disableSend}
      >
        Send Quote
      </SendQuoteButton>
    </FooterWrapper>
  )
}
