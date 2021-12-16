import { FC } from "react"
import styled from "styled-components"
import { ChevronIcon } from "@/components/icons"
import Button from "./Button"

export interface DropdownStyleProps {
  active?: boolean
  disabled?: boolean
  title?: string
}

export const Dropdown: FC<DropdownStyleProps> = (props) => {
  const { title, ...rest } = props

  return (
    <StyledDropdown {...rest} intent="mute">
      <span>{title}</span>
      {ChevronIcon}
    </StyledDropdown>
  )
}

const StyledDropdown = styled(Button)<DropdownStyleProps>`
  background-color: ${({ theme, active, disabled }) =>
    active
      ? theme.dropdown.active.backgroundColor
      : disabled
      ? theme.dropdown.disabled.backgroundColor
      : theme.dropdown.backgroundColor};
  color: ${({ theme }) => theme.dropdown.textColor};
  min-width: 80px;

  svg > path {
    fill: ${({ theme }) => theme.dropdown.textColor};
  }

  & > span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export default Dropdown
