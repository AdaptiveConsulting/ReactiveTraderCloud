import React, { Suspense } from "react"
import styled from "styled-components"

import { WithChildren } from "@/client/utils/utilityTypes"

const Background = styled.div`
  height: 100%;
  user-select: none;

  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
`

interface Props {
  fallback: React.ReactNode
  className?: string
}

export const RegionWrapper = React.forwardRef<
  HTMLDivElement,
  WithChildren & Props
>(function RegionWrapperInner({ fallback, children, className }, ref) {
  return (
    <Background className={className} ref={ref}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Background>
  )
})
