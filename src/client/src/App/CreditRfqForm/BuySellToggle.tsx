import { FC } from "react"
import styled from "styled-components"
import { Button } from "../Footer/common-styles"

const BuySellToggleWrapper = styled.div`
  display: flex;
`
export const BuySellToggle: FC = () => {
  return (
    <BuySellToggleWrapper>
      <Button>Buy</Button>
      <Button>Sell</Button>
    </BuySellToggleWrapper>
  )
}
