import styled from "styled-components"

import {
  tabBackgroundColor,
  TabStyled,
} from "@/client/components/TabBar/TabBar.styled"

import { TabStates } from "../atomStates"

interface Props {
  state: TabStates
}

export const AtomsTab = styled(TabStyled)<Props>`
  background-color: ${({ state, theme }) => {
    switch (state) {
      case TabStates.Normal:
        return theme.newTheme.color["Colors/Background/bg-secondary"]
      case TabStates.Hover:
        return theme.newTheme.color[tabBackgroundColor["hover"]]
      case TabStates.Active:
        return theme.newTheme.color[tabBackgroundColor["active"]]
    }
  }};
  height: ${({ theme }) => theme.newTheme.density.md};
  pointer-events: none;
`
