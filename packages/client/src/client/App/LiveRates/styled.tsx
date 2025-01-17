import styled from "styled-components"

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_alt"]};
`
export const LeftNav = styled.ul`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 915px) {
    display: none;
  }
`

export const RightNav = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: row-reverse;
  list-style-type: none;
  list-style: none;
`

export const LiStyle = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`

export const NavItem = styled(LiStyle)<{ active: boolean }>`
  width: ${({ theme }) => theme.newTheme.spacing["9xl"]};
  list-style-type: none;
  height: ${({ theme }) => theme.newTheme.density.md};
  color: ${({ theme, active }) =>
    active
      ? theme.newTheme.color["Colors/Text/text-brand-primary (900)"]
      : "inherit"};
  background-color: ${({ active, theme }) =>
    active ? theme.newTheme.color["Colors/Background/bg-tertiary"] : "none"};
  text-decoration: none;
  text-align: center;
`

export const IconNavItem = styled(NavItem)`
  width: auto;
  display: flex;
  align-items: center;
  line-height: 0;
  width: ${({ theme }) => theme.newTheme.density.md};
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

export const CurrencyDropdown = styled.div`
  margin-right: auto;
  @media (min-width: 915px) {
    display: none;
  }
  @media (max-width: 915px) {
    display: flex;
    justify-content: space-between;
  }
  @media (max-width: 400px) {
    padding-top: 10px;
  }
`
