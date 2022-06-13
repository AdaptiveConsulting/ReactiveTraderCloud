import { useCreditDealers } from "@/services/creditDealers"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import styled from "styled-components"

const CounterpartySelectionWrapper = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  max-height: 100%;
`

const CounterpartySelectionHeader = styled.header`
  font-size: 13px;
  padding: 8px 0;
`

const CounterpartyList = styled.div`
  padding: 2px 0;
  overflow: auto;
`

const CounterpartyListItem = styled.li`
  display: flex;
  align-items: center;
  height: 24px;
  list-style: none;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.primary.base};
  }

  & > input {
    -webkit-appearance: none;
    background-color: transparent;
    width: 11px;
    height: 11px;
    border: 1px solid ${({ theme }) => theme.primary[5]};
    border-radius: 1px;
  }

  & > input:checked {
    border: none;
    background-color: ${({ theme }) => theme.accents.primary.base};
  }

  & > span {
    margin-left: 10px;
  }
`

export const [selectedCounterpartyIds$, setSelectedCounterpartyIds] =
  createSignal<number[]>()
export const [useSelectedCounterpartyIds] = bind(selectedCounterpartyIds$, [])

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

  return (
    <CounterpartySelectionWrapper>
      <CounterpartySelectionHeader>
        Counterparty Selection
      </CounterpartySelectionHeader>
      <CounterpartyList>
        {counterparties.map((dealer) => (
          <CounterpartyListItem
            key={dealer.id}
            onClick={() => onToggleCounterparty(dealer.id)}
          >
            <input
              type="checkbox"
              checked={selectedCounterpartyIds.includes(dealer.id)}
              onChange={() => onToggleCounterparty(dealer.id)}
            />
            <span>{dealer.name}</span>
          </CounterpartyListItem>
        ))}
      </CounterpartyList>
    </CounterpartySelectionWrapper>
  )
}
