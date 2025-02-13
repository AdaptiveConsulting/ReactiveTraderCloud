import React from "react"
import styled from "styled-components"

const TextInputText = styled.input(
  ({ theme }) => theme.newTheme.textStyles["Text md/Regular"],
)

const TextInputInner = styled(TextInputText)<Partial<HTMLInputElement>>`
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

${
  !disabled &&
  `
    &:hover{
        border-color: ${theme.newTheme.color["Colors/Border/border-hover"]};
    }

    &:active {
        border-color: ${theme.newTheme.color["Colors/Border/border-brand"]};
    }

    &:focus {
        outline: 2px solid ${theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
        outline-offset: 1px;
    }
    `
}

`}
`

interface Props {
  name?: string
  id?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  function InputTest({ value, ...props }, ref) {
    return <TextInputInner value={value} ref={ref} {...props} />
  },
)
