import { bind, SUSPENSE } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map } from "rxjs/operators"

import { RadioInputList } from "@/client/components/FormControl/RadioInputList"
import { RadioInputListItems } from "@/client/components/FormControl/types"
import { DealerBody } from "@/generated/TradingGateway"
import { ADAPTIVE_BANK_NAME, creditDealers$ } from "@/services/credit"

import { FormControl } from "../../../components/FormControl/FormControl"

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

  const items: RadioInputListItems = counterparties.map(({ id, name }) => ({
    checked: selectedCounterpartyIds.includes(id),
    name,
  }))

  return (
    <FormControl label="Counterparty Selection">
      <RadioInputList
        items={items}
        onChange={(counterParty) =>
          onToggleCounterparty(
            (
              counterparties.find(
                ({ name }) => name === counterParty,
              ) as DealerBody
            ).id,
          )
        }
      />
    </FormControl>
  )
}
