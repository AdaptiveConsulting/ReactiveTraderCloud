import { FC } from "react"
import styled from "styled-components"

export interface DropdownOptionStyleProps {
  active?: boolean
  hover?: boolean
  disabled?: boolean
  option?: string
}

export type DropdownMenuStyleProps = DropdownOptionStyleProps & {
  options: any[]
}

const DropdownMenuOption: FC<DropdownOptionStyleProps> = (props) => (
  <DropdownMenuOptionStyled {...props}>{props.option}</DropdownMenuOptionStyled>
)

export const DropdownMenu: FC<DropdownMenuStyleProps> = (props) => {
  const { options, active, hover, disabled } = props

  return (
    <DropdownMenuContainer>
      <DropdownMenuOption
        option="option 1"
        active={active}
        hover={hover}
        disabled={disabled}
      />
      {options.map((option) => (
        <DropdownMenuOption option={option} key={option} />
      ))}
    </DropdownMenuContainer>
  )
}

const StyledBase = styled.div<DropdownOptionStyleProps>`
  width: 100%;
  min-width: 100px;
  font-size: 0.8rem;
  padding: 8px 15px;
  text-align: left;
  border-radius: 3px;
  background-color: ${({ active, theme, hover }) =>
    active
      ? theme.button.primary.backgroundColor
      : hover
      ? theme.primary.base
      : ""};
  text-decoration: ${({ hover }) => (hover ? "underline" : "none")};
  color: ${({ theme }) => theme.core.textColor};
`

const StyledButtonBase = StyledBase.withComponent("button")
const DropdownMenuOptionStyled: any = styled(
  StyledButtonBase,
)<DropdownOptionStyleProps>``

const DropdownMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 5px;
  border-radius: 3px;
  box-shadow: 0 0.25rem 0.375rem rgba(50, 50, 93, 0.11),
    0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08);
  background-color: ${({ theme }) => theme.core.dividerColor};
`

export default DropdownMenu
