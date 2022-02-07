import styled from "styled-components"

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 6px;
  color: ${({ theme }) => theme.core.textColor};
`
export const LeftNav = styled.ul`
  display: flex;
  align-self: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 915px) {
    display: none;
  }
`
export const LiStyle = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`
export const LeftNavItemFirst = styled(LiStyle)`
  list-style-type: none;
  margin-right: 30px;
  font-size: 16px;
  &:hover {
    cursor: default;
  }
  @media (max-width: 768px) {
    margin-right: 5px;
  }
`

export const NavItem = styled(LiStyle)<{ active: boolean }>`
  list-style-type: none;
  margin-left: 15px;

  color: ${({ theme }) => theme.secondary.base};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 34px;
  line-height: 34px;
  opacity: ${({ active }) => (active ? "1" : "0.52")};
  background: ${({ active, theme }) =>
    active ? theme.core.lightBackground : "none"};
  text-decoration: none;
  padding: 5px;
  min-width: 34px;
  min-height: 34px;
  text-align: center;
  border-radius: 2px;
`

export const LeftNavTitle = styled.span`
  margin: auto 0;
  display: none;
  text-align: center;
  margin-top: 8px;

  @media (max-width: 915px) {
    display: block;
  }
`

export const RightNav = styled.ul`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  list-style: none;
`

export const Rect = styled.div`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.core.textColor};
  width: 10px;
  height: 10px;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.core.textColor};
`

export const DropdownWrapper = styled.div`
  display: none;
  position: relative;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;

  @media (max-width: 915px) {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 400px) {
    padding-top: 10px;
  }

  .dd-placeholder {
    padding-right: 20px;
  }

  i {
    font-size: 10px;
  }
`

export const DropdownMenu = styled.div`
  border-radius: 4px;
  position: absolute;
  top: 40px;
  left: 0px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  z-index: 100;
`

export const DropdownOption = styled.div<{ selected: boolean }>`
  padding: 8px 8px 5px 8px;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.core.activeColor : "inherit"};
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    text-decoration: underline;
  }

  i {
    padding-left: 20px;
  }
`
