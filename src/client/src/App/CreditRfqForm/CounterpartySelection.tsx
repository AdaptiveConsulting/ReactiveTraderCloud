import { useCreditDealers } from "@/services/creditDealers"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import styled from "styled-components"

const CounterpartySelectionWrapper = styled.div`
  font-size: 12px;
  font-weight: 500;
`

const CounterpartySelectionHeader = styled.header`
  font-size: 13px;
  padding: 8px 0;
`

const CounterpartyList = styled.div`
  padding: 2px 0;

  & > li {
    display: flex;
    align-items: center;
    list-style: none;
    height: 24px;
  }

  & > li:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.primary.base};
  }

  & > li > input {
    background-color: transparent;
  }

  & > li > span {
    margin-left: 10px;
  }
`

const [selectedCounterpartyIds$, setSelectedCounterpartyIds] =
  createSignal<number[]>()
const [useSelectedCounterpartyIds] = bind(selectedCounterpartyIds$, [])

export const CounterpartySelection: FC = () => {
  const counterparties = useCreditDealers()
  const selectedCounterpartyIds = useSelectedCounterpartyIds()

  const onToggleCounterparty = (counterpartyId: number) => {
    const newCounterparties = selectedCounterpartyIds.includes(counterpartyId)
      ? selectedCounterpartyIds.filter(
          (counterparty) => counterparty !== counterpartyId,
        )
      : [...selectedCounterpartyIds, counterpartyId]
    setSelectedCounterpartyIds(newCounterparties)
  }

  console.log(selectedCounterpartyIds)

  return (
    <CounterpartySelectionWrapper>
      <CounterpartySelectionHeader>
        Counterparty Selection
      </CounterpartySelectionHeader>
      <CounterpartyList>
        {counterparties.map((dealer) => (
          <li key={dealer.id} onClick={() => onToggleCounterparty(dealer.id)}>
            <input
              type="checkbox"
              checked={selectedCounterpartyIds.includes(dealer.id)}
              onChange={() => onToggleCounterparty(dealer.id)}
            />
            <span>{dealer.name}</span>
          </li>
        ))}
      </CounterpartyList>
    </CounterpartySelectionWrapper>
  )
}
