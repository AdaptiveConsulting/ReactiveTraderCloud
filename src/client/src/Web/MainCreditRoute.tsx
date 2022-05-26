import { CreditRfqForm } from "@/App/CreditRfqForm"
import Resizer from "@/components/Resizer"
import styled from "styled-components"
import MainLayout from "./MainLayout"

const Placeholder = styled.div`
  margin: 3em;
`

const MainCreditRoute: React.FC = () => {
  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        <Placeholder>RFQ List Placeholder</Placeholder>
        <Placeholder>Credit Blotter Placeholder</Placeholder>
      </Resizer>
      <CreditRfqForm />
    </MainLayout>
  )
}
export default MainCreditRoute
