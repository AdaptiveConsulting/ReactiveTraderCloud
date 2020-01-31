import React from 'react'
import { styled } from 'rt-theme'

export interface DropdownOptionStyleProps {
  active?: boolean
  hover?: boolean
  disabled?: boolean
  option?: string
}

export type DropdownMenuStyleProps = DropdownOptionStyleProps & {
  options: any[]
}

const DropdownMenuOption: React.FC<DropdownOptionStyleProps> = props => (
  <DropdownMenuOptionStyled {...props}>{props.option}</DropdownMenuOptionStyled>
)

export const DropdownMenu: React.FC<DropdownMenuStyleProps> = props => {
  const { options, active, hover, disabled } = props

  return (
    <DropdownMenuContainer>
      <DropdownMenuOption option="option 1" active={active} hover={hover} disabled={disabled} />
      {options.map(option => (
        <DropdownMenuOption option={option} />
      ))}
    </DropdownMenuContainer>
  )
}

const StyledBase = styled.div<DropdownOptionStyleProps>`
  width: 100%;
  min-width: 120px;
  font-size: 0.8rem;
  padding: 8px 15px;
  text-align: left;
  border-radius: 3px;
  background-color: ${({ active, theme }) => (active ? theme.button.primary.backgroundColor : '')};
  text-decoration: ${({ hover }) => (hover ? 'underline' : 'none')};
  color: ${({ disabled, theme }) =>
    disabled ? theme.dropdown.disabled.textColor : theme.dropdown.textColor};
`

const StyledButtonBase = StyledBase.withComponent('button')
const DropdownMenuOptionStyled: any = styled(StyledButtonBase)<DropdownOptionStyleProps>``

const DropdownMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 5px;
  border-radius: 3px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.primary.base};
`

export default DropdownMenu
