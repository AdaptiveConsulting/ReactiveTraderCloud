import { FormControl } from "@/client/components/FormControl/FormControl"
import { TextInput } from "@/client/components/FormControl/TextInput"

import { CounterpartySelection } from "./CounterpartySelection"
import { DirectionToggle } from "./DirectionToggle"
import { RfqButtonPanel } from "./RfqButtonPanel"
import { RfqParameters } from "./RfqParameters"
import { TicketWrapper } from "./styled"

export const NewRfqForm = () => (
  <TicketWrapper>
    <DirectionToggle />
    {/* <CreditInstrumentSearch /> */}
    <FormControl label="Instrument">
      <TextInput placeholder="Enter a CUSIP" />
    </FormControl>
    <RfqParameters />
    <FormControl label="Fill Type">
      <TextInput placeholder="All or None" disabled />
    </FormControl>
    <CounterpartySelection />
    <RfqButtonPanel />
  </TicketWrapper>
)
