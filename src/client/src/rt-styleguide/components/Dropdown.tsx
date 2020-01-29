import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'

export interface DropdownStyleProps {
  active?: boolean
  disabled?: boolean
  title?: string
}

export const Dropdown: React.FC<DropdownStyleProps> = props => {
  const { title, ...rest } = props

  return (
    <Button {...rest} intent="mute">
      {`${title} `}
      <FontAwesomeIcon icon={faAngleDown} />
    </Button>
  )
}

export default Dropdown
