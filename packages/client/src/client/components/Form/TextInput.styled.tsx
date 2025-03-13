import styled from "styled-components"

export const TextInputStyled = styled.input<Partial<HTMLInputElement>>`
  ${({ theme }) => theme.textStyles["Text md/Regular"]}
  ${({ theme, disabled }) => `
  height: 28px;
  width: 100%;
  color: ${theme.color["Colors/Text/text-primary (900)"]};
  background-color: ${disabled ? theme.color["Colors/Background/bg-secondary_subtle"] : theme.color["Colors/Background/bg-secondary"]};
  border: ${theme.color["Colors/Border/border-secondary"]} solid 1px;
  padding: 0 ${theme.spacing.sm};
  margin: 0;
  
  ::placeholder {
    color: ${theme.color["Colors/Text/text-placeholder"]};
  }
  `}

  ${({ disabled, theme }) =>
    !disabled &&
    `
  &:hover,
  &.sg-text-input-hover {
    border-color: ${theme.color["Colors/Border/border-hover"]};
  }

  &:active,
  &.sg-text-input-active {
       border-color: ${theme.color["Colors/Border/border-brand"]};
  }

  &:focus,
  &.sg-text-input-focus {
        outline: 2px solid
      ${theme.color["Colors/Effects/Focus rings/focus-ring"]};
    outline-offset: 1px;
  }
  `}
`
