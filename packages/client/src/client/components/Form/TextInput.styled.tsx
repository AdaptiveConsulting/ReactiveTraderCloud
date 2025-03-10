import styled, { css } from "styled-components"

export const stateStyles = {
  hover: css`
    border-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Border/border-hover"]};
  `,
  active: css`
    border-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Border/border-brand"]};
  `,
  focus: css`
    outline: 2px solid
      ${({ theme }) =>
        theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
    outline-offset: 1px;
  `,
}

const TextInputText = styled.input(
  ({ theme }) => theme.newTheme.textStyles["Text md/Regular"],
)

export const TextInputStyled = styled(TextInputText)<Partial<HTMLInputElement>>`
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

  &:hover {
    ${({ disabled }) => !disabled && stateStyles.hover}
  }

  &:active {
    ${({ disabled }) => !disabled && stateStyles.active};
  }

  &:focus {
    ${({ disabled }) => !disabled && stateStyles.focus}
  }
`
