import { FC } from "react"
import styled from "styled-components"
import { Button } from "../Footer/common-styles"

const RfqButtonPanelWrapper = styled.div`
  display: flex;
  position: fixed;
  bottom: 4em;
`
export const RfqButtonPanel: FC = () => {
  return (
    <RfqButtonPanelWrapper>
      <Button>Clear</Button>
      <Button>Send RFQ</Button>
    </RfqButtonPanelWrapper>
  )
}
