import { Loader } from "@/components/Loader"
import { Subscribe } from "@react-rxjs/core"
import { FC } from "react"
import { CreditSellSideTicketCore } from "./CreditSellSideTicketCore"

interface CreditSellSideTicketProps {
  rfqId: number
  dealerId: number
}

export const CreditSellSideTicket: FC<CreditSellSideTicketProps> = (props) => {
  return (
    <Subscribe fallback={<Loader ariaLabel="Loading RFQ" />}>
      <CreditSellSideTicketCore {...props} />
    </Subscribe>
  )
}
