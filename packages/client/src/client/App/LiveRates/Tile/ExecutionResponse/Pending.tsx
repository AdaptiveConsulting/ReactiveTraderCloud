import styled from "styled-components"

import { AdaptiveLoader } from "@/client/components/AdaptiveLoader"
import { CenteringContainer } from "@/client/components/CenteringContainer"
import { OverlayDiv } from "@/client/components/OverlayDiv"

const PendingContainer = styled(OverlayDiv)`
  // Solution to stack flex child ontop of another, height is not respected in safari
  // margin-left: -100%;
  position: absolute;
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
      <CenteringContainer>
        <PendingPill>
          <AdaptiveLoader
            size={14}
            speed={0.8}
            separation={1.5}
            color="Colors/Foreground/fg-white"
            type="secondary"
          />
          {"  Executing"}
        </PendingPill>
      </CenteringContainer>
    </PendingContainer>
  )
}

export default Pending
