import styled from "styled-components"

export const Label = styled.label`
  ${({ theme }) => theme.textStyles["Text sm/Regular"]}
  color: ${({ theme }) => theme.color["Colors/Text/text-tertiary (600)"]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`
