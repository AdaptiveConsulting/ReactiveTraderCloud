import styled from "styled-components"

import { Spacing } from "../theme/types"

export const Line = styled.div<{ height?: Spacing }>`
  height: ${({ theme, height }) =>
    height ? theme.newTheme.spacing[height] : "100%"};
  width: 1px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-quaternary"]};
`
