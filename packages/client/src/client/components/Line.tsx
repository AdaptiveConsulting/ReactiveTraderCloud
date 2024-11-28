import styled from "styled-components"

import { theme } from "../theme/uisk"

export const Line = styled.div<{ height?: keyof typeof theme.spacing }>`
  height: ${({ theme, height }) =>
    height ? theme.newTheme.spacing[height] : "100%"};
  width: 1px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-quaternary"]};
`
