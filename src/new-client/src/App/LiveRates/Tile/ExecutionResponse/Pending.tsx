import { AdaptiveLoader } from "components/AdaptiveLoader"
import styled from "styled-components/macro"
import { OverlayDiv } from "components/OverlayDiv"
import { CenteringContainer } from "components/CenteringContainer"

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
    <OverlayDiv>
      <CenteringContainer>
        <PendingPill>
          <AdaptiveLoader
            size={14}
            speed={0.8}
            separation={1.5}
            color="white"
            type="secondary"
          />
          {"  Executing"}
        </PendingPill>
      </CenteringContainer>
    </OverlayDiv>
  )
}

export default Pending
