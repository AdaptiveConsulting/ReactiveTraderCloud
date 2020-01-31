import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'
import Button from './Button'

export interface DropdownStyleProps {
  active?: boolean
  disabled?: boolean
  title?: string
}

export const Dropdown: React.FC<DropdownStyleProps> = props => {
  const { title, ...rest } = props

  return (
    <StyledDropdown {...rest} intent="mute">
      <span>{title}</span>
      <FontAwesomeIcon icon={faAngleDown} />
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
  color: ${({ theme, disabled }) =>
    disabled ? theme.dropdown.disabled.textColor : theme.dropdown.textColor};}
  min-width: 80px;

  & > span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export default Dropdown
