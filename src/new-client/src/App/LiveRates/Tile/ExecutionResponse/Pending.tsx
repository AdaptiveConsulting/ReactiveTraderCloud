import { AdaptiveLoader } from "components/AdaptiveLoader"
import styled from "styled-components/macro"
import { OverlayDiv } from "./Response.styles"

const PendingContainer = styled(OverlayDiv)`
  display: table;
`

const PendingPopUp = styled("div")`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`

const PendingPill = styled("div")`
  background-color: ${({ theme }) => theme.accents.primary.base};
  margin-auto;
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
`

const Pending = () => {
  return (
    <PendingContainer>
      <PendingPopUp>
        <PendingPill>
          <AdaptiveLoader
            size={14}
            speed={0.8}
            seperation={1.5}
            color="white"
            type="secondary"
          />
          {"  Executing"}
        </PendingPill>
      </PendingPopUp>
    </PendingContainer>
  )
}

export default Pending
