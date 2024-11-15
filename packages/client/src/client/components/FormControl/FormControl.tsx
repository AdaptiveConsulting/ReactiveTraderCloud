import { PropsWithChildren } from "react"
import styled from "styled-components"

import { Typography } from "@/client/components/Typography"

const Label = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.newTheme.spacing.xs};
`

export const FormControl = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => (
  <div>
    <Label variant="Text xs/Regular" color="Colors/Text/text-tertiary (600)">
      {label}
    </Label>
    {children}
  </div>
)
