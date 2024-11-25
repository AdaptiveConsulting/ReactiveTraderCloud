import { Button } from "@/client/components/Button"
import { CheckBoxInput } from "@/client/components/Form/CheckBoxInput.tsx/CheckBoxInput"
import { FormControl } from "@/client/components/Form/FormControl/FormControl"
import { Label } from "@/client/components/Form/FormControl/Label"
import { TextInput } from "@/client/components/Form/TextInput"
import { Toggle } from "@/client/components/Toggle"
import { customNumberFormatter } from "@/client/utils"
import { Direction } from "@/generated/TradingGateway"

import { CreditInstrumentSearch } from "./components/CreditInstrumentSearch"
import {
  clear,
  CLEAR_DEALER_IDS,
  sendRfq,
  setDirection,
  setQuantity,
  updateDealerIds,
  useFormState,
  useIsValid,
  useSortedCreditDealers,
} from "./state"
import { Form, Row } from "./styled"

const formatter = customNumberFormatter()

export const NewRfqForm = () => {
  const counterparties = useSortedCreditDealers()
  const valid = useIsValid()
  const [direction, , quantity, dealerIds] = useFormState()

  const items = counterparties.map(({ id, name }) => ({
    id,
    name,
  }))

  return (
    <Form>
      <Toggle
        left="You Buy"
        right="You Sell"
        onChange={() =>
          setDirection(
            direction === Direction.Buy ? Direction.Sell : Direction.Buy,
          )
        }
        isToggled={direction === Direction.Sell}
      />

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
                  .forEach(({ id }) => updateDealerIds({ id, checked: true }))
              : updateDealerIds({ id: CLEAR_DEALER_IDS, checked: false })
          }
        />
        {items.map(({ name, id }) => (
          <CheckBoxInput
            key={id}
            name={name}
            checked={dealerIds.includes(id)}
            onChange={(checked: boolean) => updateDealerIds({ id, checked })}
          />
        ))}
      </FormControl>

      <Row>
        <Button variant="primary" size="lg" onClick={() => clear()}>
          Clear
        </Button>
        <Button variant="brand" size="lg" onClick={sendRfq} disabled={!valid}>
          Send RFQ
        </Button>
      </Row>
    </Form>
  )
}
