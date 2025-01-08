import styled from "styled-components"

const LabelText = styled.label(
  ({ theme }) => theme.newTheme.textStyles["Text xs/Regular"],
)

export const Label = styled(LabelText)`
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
  margin-bottom: ${({ theme }) => theme.newTheme.spacing.xs};
`
