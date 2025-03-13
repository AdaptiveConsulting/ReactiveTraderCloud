import { ComponentProps } from "react"
import styled from "styled-components"

import { TabStyled } from "@/client/components/TabBar/TabBar.styled"
import { Typography } from "@/client/components/Typography"

import { TabStates } from "../atomStates"

interface Props {
  state: TabStates
}

export const AtomsTabInner = styled(TabStyled)<Props>`
  height: ${({ theme }) => theme.newTheme.density.md};
  pointer-events: none;
`

export const AtomsTab = ({
  state,
  ...props
}: Props & ComponentProps<typeof AtomsTabInner>) => {
  let className = ""
  switch (state) {
    case TabStates.Normal:
      className = "sg-tab-hover"
      break
    case TabStates.Hover:
      className = "sg-tab-hover"
      break
  }

  return (
    <AtomsTabInner
      className={className}
      active={state === TabStates.Active}
      {...props}
    >
      <Typography
        variant="Text md/Regular"
        color={
          state === TabStates.Active
            ? "Colors/Text/text-quaternary_on-brand"
            : "Colors/Text/text-quaternary (500)"
        }
      >
        {state}
      </Typography>
    </AtomsTabInner>
  )
}
