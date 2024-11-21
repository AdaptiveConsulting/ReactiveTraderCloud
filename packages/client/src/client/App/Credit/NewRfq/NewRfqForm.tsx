import styled from "styled-components"

import { CheckBoxInput } from "@/client/components/Form/CheckBoxInput.tsx/CheckBoxInput"
import { Form } from "@/client/components/Form/Form"
import { FormControl } from "@/client/components/Form/FormControl/FormControl"
import { Label } from "@/client/components/Form/FormControl/Label"
import { TextInput } from "@/client/components/Form/TextInput"
import { customNumberFormatter } from "@/client/utils"

import { CreditInstrumentSearch } from "./components/CreditInstrumentSearch"
import { DirectionToggle } from "./components/DirectionToggle"
import { RfqButtonPanel } from "./components/RfqButtonPanel"
import {
  CLEAR_DEALER_IDS,
  setDealerIds,
  setDirection,
  setQuantity,
  useFormState,
  useSortedCreditDealers,
} from "./state"
import { TicketWrapper } from "./styled"

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
`

const formatter = customNumberFormatter()

export const NewRfqForm = () => {
  const counterparties = useSortedCreditDealers()
  const items = counterparties.map(({ id, name }) => ({
    id,
    name,
  }))

  const [direction, , quantity, dealerIds] = useFormState()

  return (
    <TicketWrapper>
      <Form>
        <DirectionToggle onChange={setDirection} direction={direction} />

        <FormControl>
          <Label>Instrument</Label>
          <CreditInstrumentSearch />
        </FormControl>

        <Row>
          <FormControl>
            <Label>Quantity (000)</Label>
            <TextInput
              placeholder="1000"
              onChange={setQuantity}
              value={quantity ? formatter(quantity) : ""}
            />
          </FormControl>

          <FormControl>
            <Label>RFQ Duration</Label>
            <TextInput placeholder="2 Minutes" disabled />
          </FormControl>
        </Row>

        <FormControl>
          <Label>Fill Type</Label>
          <TextInput placeholder="All or None" disabled />
        </FormControl>

        <FormControl>
          <Label>Counterparty Selection</Label>
          <CheckBoxInput
            name="All"
            checked={dealerIds.length === items.length}
            onChange={(checked) =>
              checked
                ? items
                    .filter(({ id }) => !dealerIds.includes(id))
                    .forEach(({ id }) => setDealerIds({ id, checked: true }))
                : setDealerIds({ id: CLEAR_DEALER_IDS, checked: false })
            }
          />
          {items.map(({ name, id }) => (
            <CheckBoxInput
              key={id}
              name={name}
              checked={dealerIds.includes(id)}
              onChange={(checked: boolean) => setDealerIds({ id, checked })}
            />
          ))}
        </FormControl>

        <RfqButtonPanel />
      </Form>
    </TicketWrapper>
  )
}
