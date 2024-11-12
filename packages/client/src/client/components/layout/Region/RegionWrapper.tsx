import React, { Suspense } from "react"
import styled from "styled-components"

import { WithChildren } from "@/client/utils/utilityTypes"

const Background = styled.div`
  height: 100%;
  user-select: none;

  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary_alt"]};
`

interface Props {
  fallback: React.ReactNode
}

export const RegionWrapper = React.forwardRef<
  HTMLDivElement,
  WithChildren & Props
>(function RegionWrapperInner({ fallback, children }, ref) {
  return (
    <Background ref={ref}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Background>
  )
})
