import styled from "styled-components"

export const TextInputStyled = styled.input<Partial<HTMLInputElement>>`
  ${({ theme }) => theme.newTheme.textStyles["Text md/Regular"]}
  ${({ theme, disabled }) => `
  height: 28px;
  width: 100%;
  color: ${theme.newTheme.color["Colors/Text/text-primary (900)"]};
  background-color: ${disabled ? theme.newTheme.color["Colors/Background/bg-secondary_subtle"] : theme.newTheme.color["Colors/Background/bg-secondary"]};
  border: ${theme.newTheme.color["Colors/Border/border-secondary"]} solid 1px;
  padding: 0 ${theme.newTheme.spacing.sm};
  margin: 0;
  
  ::placeholder {
    color: ${theme.newTheme.color["Colors/Text/text-placeholder"]};
  }
  `}

  ${({ disabled, theme }) =>
    !disabled &&
    `
  &:hover,
  &.sg-text-input-hover {
    border-color: ${theme.newTheme.color["Colors/Border/border-hover"]};
  }

  &:active,
  &.sg-text-input-active {
       border-color: ${theme.newTheme.color["Colors/Border/border-brand"]};
  }

  &:focus,
  &.sg-text-input-focus {
        outline: 2px solid
      ${theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
    outline-offset: 1px;
  }
  `}
`
