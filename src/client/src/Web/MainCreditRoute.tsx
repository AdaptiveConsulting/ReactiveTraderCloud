import { CreditRfqForm } from "@/App/CreditRfqForm"
import { CreditRfqs } from "@/App/CreditRfqs"
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
        <CreditRfqs />
        <Placeholder>Credit Blotter Placeholder</Placeholder>
      </Resizer>
      <CreditRfqForm />
    </MainLayout>
  )
}
export default MainCreditRoute
