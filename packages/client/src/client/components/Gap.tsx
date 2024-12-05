import styled from "styled-components"

import { Spacing } from "../theme/types"

interface Props {
  height?: Spacing
  width?: Spacing
}

export const Gap = styled.div<Props>`
  ${({ height, width, theme }) => `
        height: ${height && theme.newTheme.spacing[height]};
        width: ${width && theme.newTheme.spacing[width]};
  `}
`