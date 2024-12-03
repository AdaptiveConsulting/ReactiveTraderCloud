import styled from "styled-components"

import { Typography } from "../../Typography"

const _Label = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.newTheme.spacing.xs};
`

export const Label = (props: React.ComponentProps<typeof Typography>) => (
  <_Label
    variant="Text xs/Regular"
    color="Colors/Text/text-tertiary (600)"
    {...props}
  />
)
