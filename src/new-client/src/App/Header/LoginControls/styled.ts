import styled from "styled-components"

interface DropdownMenuProps {
  showMenu: boolean
}

interface CircleProps {
  full: boolean
}

export const Button = styled.button`
  width: 84px;
  height: 32px;
  border-radius: 3px;
  font-size: 0.75rem;
`

export const SignInButton = styled(Button)`
  background-color: ${({ theme }) => theme.accents.primary.base};
  color: ${({ theme }) => theme.white};
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`
export const LoadingButton = styled(SignInButton)`
  width: 32px;
  padding-top: 3px;
`

export const DropdownWrapper = styled.div`
  position: relative;
`
export const DropdownButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary.base};
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.base};
    color: ${({ theme }) => theme.white};
  }
`
export const UserWrapper = styled.div`
  position: relative;
`
export const UserContainer = styled(Button)`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-left: 1px solid ${({ theme }) => theme.core.dividerColor};
  border-radius: 0;
  height: 24px;
  padding-left: 5px;
`

export const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  filter: grayscale(1);
  ${DropdownButton}:hover & {
    filter: grayscale(0);
  }
`
export const DropdownMenu = styled.div<DropdownMenuProps>`
  background: ${({ theme }) => theme.primary[1]};
  display: ${({ showMenu }) => (showMenu ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  right: 0;
  border-radius: 3px;
  font-size: 0.75rem;
  padding: 6px;
  width: max-content;
`
export const Option = styled.button`
  width: 100px;
  height: 26px;
  text-align: left;
  padding: 3px 9px;
  &:hover {
    background-color: ${({ theme }) => theme.primary.base};
    text-decoration: underline;
  }
`
export const Title = styled.div`
  width: 100px;
  height: 26px;
  text-align: left;
  padding: 6px 9px;
`
export const Separator = styled.hr`
  color: ${({ theme }) => theme.primary.base};
  margin: 8px 0;
`
export const Circle = styled.div<CircleProps>`
  display: inline-block;
  width: 9px;
  height: 9px;
  background-color: ${({ theme, full }) =>
    full ? theme.secondary.base : "transparent"};
  border: ${({ theme, full }) =>
    full ? "1px solid transparent" : `1px solid ${theme.primary[5]}`};
  border-radius: 50%;
  margin-right: 2px;
`
