import { CreditRfqForm } from "@/App/CreditRfqForm"
import { CreditRfqs } from "@/App/CreditRfqs"
import Resizer from "@/components/Resizer"
import styled from "styled-components"
import MainLayout from "./MainLayout"
import { Trades } from "@/App/Trades"

const Placeholder = styled.div`
  margin: 3em;
`

const MainCreditRoute: React.FC = () => {
  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        <CreditRfqs />
        <Trades credit={true} />
      </Resizer>
      <CreditRfqForm />
    </MainLayout>
  )
}
export default MainCreditRoute
