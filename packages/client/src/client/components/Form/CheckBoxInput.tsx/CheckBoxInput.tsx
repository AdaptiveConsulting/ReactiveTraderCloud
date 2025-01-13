import styled from "styled-components"

import Check from "@/client/components/icons/svg/tick.svg"

import { FlexBox } from "../../FlexBox"
import { Typography } from "../../Typography"

const CheckBoxInputWrapper = styled(FlexBox)`
  border-bottom: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-tertiary"]};
  padding: ${({ theme }) => theme.newTheme.spacing.sm};
  gap: ${({ theme }) => theme.newTheme.spacing.md};
`

const CheckBox = styled.input.attrs({ type: "checkbox" })<{
  checked: boolean
}>`
  appearance: none;
  background-color: "transparent";
  border: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
  width: 14px;
  height: 14px;
  border-radius: 4px;

  &:hover {
    border: 1px solid
      ${({ theme }) => theme.newTheme.color["Colors/Background/bg-brand-solid"]};
  }

  ${({ theme, checked }) =>
    checked &&
    `
    background-color: ${theme.newTheme.color["Colors/Background/bg-brand-solid"]};
    background-image: url("${Check}");

    &:hover {
      background-color: ${theme.newTheme.color["Colors/Background/bg-brand-solid_hover"]}
    }
  `}
`

interface Props {
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const CheckBoxInput = ({ name, checked, onChange }: Props) => {
  return (
    <CheckBoxInputWrapper key={name}>
      <CheckBox
        id={name}
        checked={checked}
        onChange={({ target }) => onChange(target.checked)}
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
