import styled from "styled-components"

export const Label = styled.label`
  ${({ theme }) => theme.newTheme.textStyles["Text sm/Regular"]}
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
  margin-bottom: ${({ theme }) => theme.newTheme.spacing.xs};
`
