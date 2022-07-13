import { FC } from "react"
import styled from "styled-components"
import { CreditTimer } from "../CreditTimer"

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 16px;
  padding: 0 16px;
`

interface CreditSellSideFooterProps {
  start: number
  end: number
}

export const CreditSellSideTimer: FC<CreditSellSideFooterProps> = ({
  start,
  end,
}) => (
  <TimerWrapper>
    <CreditTimer start={start} end={end} isSellSideView={true} />
  </TimerWrapper>
)
