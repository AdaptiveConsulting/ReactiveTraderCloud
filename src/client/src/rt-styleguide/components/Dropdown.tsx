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
    active ? theme.primary[2] : disabled ? theme.primary[1] : theme.primary.base};
  min-width: 80px;

  & > span {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > svg {
      font-weight: 100;
    }
  }
`

export default Dropdown
