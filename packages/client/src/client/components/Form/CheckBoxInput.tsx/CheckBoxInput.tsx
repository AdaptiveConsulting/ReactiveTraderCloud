import styled, { css } from "styled-components"

import Check from "@/client/components/icons/svg/tick.svg"

import { Stack } from "../../Stack"
import { Typography } from "../../Typography"

const CheckBoxInputWrapper = styled(Stack)`
  border-bottom: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-tertiary"]};
  padding: ${({ theme }) => theme.newTheme.spacing.sm};
  gap: ${({ theme }) => theme.newTheme.spacing.md};
`

export const hover = css`
  border: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-brand-solid"]};
`

export const focus = css`
  outline: 2px solid
    ${({ theme }) =>
      theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
  outline-offset: 1px;
`

export const CheckBox = styled.input.attrs({ type: "checkbox" })<{
  checked: boolean
  disabled?: boolean
}>`
  appearance: none;
  background-color: transparentz;
  border: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
  width: 14px;
  height: 14px;
  border-radius: 4px;

  background-color: ${({ theme, disabled }) =>
    disabled && theme.newTheme.color["Colors/Background/bg-disabled_subtle"]};

  &:hover {
    ${({ disabled }) => !disabled && hover}
  }

  &:focus {
    ${({ disabled }) => !disabled && focus}
  }

  ${({ theme, checked, disabled }) =>
    checked &&
    `
    background-color: ${!disabled && theme.newTheme.color["Component colors/Utility/Blue/utility-blue-300"]};
    background-image: url("${Check}");

  `}
`

interface Props {
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const CheckBoxInput = ({
  name,
  checked,
  onChange,
  disabled,
  className,
}: Props) => {
  return (
    <CheckBoxInputWrapper key={name} className={className}>
      <CheckBox
        id={name}
        checked={checked}
        onChange={({ target }) => onChange(target.checked)}
        disabled={disabled}
      />
      <label htmlFor={name}>
        <Typography
          variant="Text sm/Regular"
          color="Colors/Text/text-secondary (700)"
        >
          {name}
        </Typography>
      </label>
    </CheckBoxInputWrapper>
  )
}
