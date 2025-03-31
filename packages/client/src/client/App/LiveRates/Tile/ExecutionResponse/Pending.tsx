import styled from "styled-components"

import { AdaptiveLoader } from "@/client/components/AdaptiveLoader"
import { CenteringContainer } from "@/client/components/CenteringContainer"
import { OverlayDiv } from "@/client/components/OverlayDiv"
import { Typography } from "@/client/components/Typography"

const PendingPill = styled("div")`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-brand-primary"]};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.full};
`

export const Pending = () => {
  return (
    <OverlayDiv>
      <CenteringContainer>
        <PendingPill>
          <AdaptiveLoader
            size={14}
            speed={0.8}
            separation={1.5}
            color="Colors/Foreground/fg-primary (900)"
            type="secondary"
          />
          <Typography variant="Text md/Bold">Executing</Typography>
        </PendingPill>
      </CenteringContainer>
    </OverlayDiv>
  )
}
