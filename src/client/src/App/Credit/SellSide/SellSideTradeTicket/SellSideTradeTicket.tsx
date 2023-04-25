import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components"

import { Loader } from "@/components/Loader"
import { useAdaptiveDealerId } from "@/services/credit"

import { useSelectedRfqId } from "../sellSideState"
import { focused$ } from "../utils/useIsFocused"
import { SellSideTradeTicketTicketCore } from "./SellSideTradeTicketCore"

const SellSideWrapper = styled.div`
  z-index: 1;
  min-height: 220px;
  max-height: 220px;
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  border: 1px solid ${({ theme }) => theme.core.dividerColor};
`

const NoSelectedWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 8px 12px 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.core.textColor};
`

const NoSelectHeader = styled.div`
  padding: 8px 0;
  font-size: 11px;
  flex: 0 1 auto;
  background-color: ${({ theme }) => theme.core.darkBackground};
`

const NoSelectedMessage = styled.div`
  width: 100%;
  flex: 1 1 auto;
  text-align: center;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 1px solid ${({ theme }) => theme.core.dividerColor};
  color: ${({ theme }) => theme.core.textColor};
`

const SellSideTradeTicketInner = () => {
  const dealerId = useAdaptiveDealerId()
  const rfqId = useSelectedRfqId()
  if (!dealerId) {
    return <Loader />
  }

  if (rfqId === null) {
    return (
      <NoSelectedWrapper>
        <NoSelectHeader>No RFQ Selected</NoSelectHeader>
        <NoSelectedMessage>
          <p>
            Click an item above to see its full details.
            <br /> You can place bids on RFQs that are still live.
          </p>
        </NoSelectedMessage>
      </NoSelectedWrapper>
    )
  }

  return <SellSideTradeTicketTicketCore rfqId={rfqId} dealerId={dealerId} />
}

export const SellSideTradeTicket = () => (
  <SellSideWrapper>
    <Subscribe fallback={<Loader />} source$={focused$}>
      <SellSideTradeTicketInner />
    </Subscribe>
  </SellSideWrapper>
)
