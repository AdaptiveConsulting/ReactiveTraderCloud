import { useCreditDealers } from "@/services/creditDealers"
import { FC } from "react"
import styled from "styled-components"

const CounterpartySelectionWrapper = styled.div`
  font-size: 12px;
  font-weight: 500;
`

const CounterpartySelectionHeader = styled.header`
  font-size: 14px;
  padding: 8px 0;
`

const CounterpartyList = styled.div`
  padding: 2px 0;
`

export const CounterpartySelection: FC = () => {
  const dealers = useCreditDealers()

  return (
    <CounterpartySelectionWrapper>
      <CounterpartySelectionHeader>
        Counterparty Selection
      </CounterpartySelectionHeader>
      <CounterpartyList>
        {dealers.map((dealer) => (
          <li key={dealer.id}>{dealer.name}</li>
        ))}
      </CounterpartyList>
    </CounterpartySelectionWrapper>
  )
}
