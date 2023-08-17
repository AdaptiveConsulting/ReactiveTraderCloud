import { bind, SUSPENSE } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { DealerBody } from "generated/TradingGateway"
import { map } from "rxjs/operators"
import { ADAPTIVE_BANK_NAME, creditDealers$ } from "services/credit"
import styled from "styled-components"

const CounterpartySelectionWrapper = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: auto;
`

const CounterpartyList = styled.div`
  padding: 2px 0;
`

const CounterpartyListItem = styled.li`
  display: flex;
  align-items: center;
  height: 24px;
  list-style: none;
  cursor: pointer;
  padding: 0 8px;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.primary.base};
  }

  & > input {
    position: relative;
    appearance: none;
    background-color: transparent;
    flex: 0 0 11px;
    height: 11px;
    border: 1px solid ${({ theme }) => theme.primary[5]};
    border-radius: 1px;
  }

  & > input:checked {
    border: none;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='11' viewBox='0.75 0.75 10.5 10.5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.0833 0.75H1.91667C1.26917 0.75 0.75 1.275 0.75 1.91667V10.0833C0.75 10.725 1.26917 11.25 1.91667 11.25H10.0833C10.7308 11.25 11.25 10.725 11.25 10.0833V1.91667C11.25 1.275 10.7308 0.75 10.0833 0.75ZM4.83333 8.91667L1.91667 6L2.73917 5.1775L4.83333 7.26583L9.26083 2.83833L10.0833 3.66667L4.83333 8.91667Z' fill='%235F94F5'/%3E%3C/svg%3E%0A");
  }

  & > span {
    flex: 1;
    margin-left: 10px;
  }
`

export const [selectedCounterpartyIds$, setSelectedCounterpartyIds] =
  createSignal<number[]>()
export const [useSelectedCounterpartyIds] = bind(selectedCounterpartyIds$, [])

// We always want the Adaptive Dealer to be at the top of the list
const [useSortedCreditDealers] = bind(
  creditDealers$.pipe(
    map((dealers) => {
      const sortedDealers = dealers.reduce((sortedDealers, dealer) => {
        if (dealer.name === ADAPTIVE_BANK_NAME) {
          sortedDealers.unshift(dealer)
        } else {
          sortedDealers.push(dealer)
        }
        return sortedDealers
      }, [] as DealerBody[])

      // suspend until we have a least one dealer as it makes no sense to render the RFQ form without being able to select a dealer
      return sortedDealers.length > 0 ? sortedDealers : SUSPENSE
    }),
  ),
)

export const CounterpartySelection = () => {
  const counterparties = useSortedCreditDealers()
  const selectedCounterpartyIds = useSelectedCounterpartyIds()

  const onToggleCounterparty = (counterpartyId: number) => {
    const newCounterparties = selectedCounterpartyIds.includes(counterpartyId)
      ? selectedCounterpartyIds.filter(
          (counterparty) => counterparty !== counterpartyId,
        )
      : [...selectedCounterpartyIds, counterpartyId]
    setSelectedCounterpartyIds(newCounterparties)
  }

  const allChecked = counterparties.length === selectedCounterpartyIds.length
  const handleToggleAllCheckbox = (checked: boolean) => {
    if (checked) {
      setSelectedCounterpartyIds(counterparties.map((c) => c.id))
    } else {
      setSelectedCounterpartyIds([])
    }
  }

  return (
    <CounterpartySelectionWrapper>
      <CounterpartyList>
        <CounterpartyListItem
          onClick={() => handleToggleAllCheckbox(!allChecked)}
        >
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleToggleAllCheckbox(e.target.checked)}
          />
          <span>All</span>
        </CounterpartyListItem>
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
