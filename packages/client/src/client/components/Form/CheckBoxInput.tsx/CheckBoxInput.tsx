import styled from "styled-components"

import Check from "../../../components/icons/svg/tick.svg"
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

  ${({ theme, checked }) =>
    checked &&
    `
    background-color: ${theme.newTheme.color["Colors/Background/bg-brand-solid"]};
    background-image: url(${Check});
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
        checked={checked}
        onChange={({ target }) => onChange(target.checked)}
      />
      <Typography
        variant="Text xs/Regular"
        color="Colors/Text/text-secondary (700)"
      >
        {name}
      </Typography>
    </CheckBoxInputWrapper>
  )
}
