import styled from "styled-components"

export const Background = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_alt"]};
`

export const LeftSection = styled.ul`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 915px) {
    display: none;
  }
`

export const RightSection = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: row-reverse;
  list-style-type: none;
  list-style: none;
`

export const Tab = styled.li<{ active: boolean }>`
  width: ${({ theme }) => theme.newTheme.spacing["9xl"]};
  height: ${({ theme }) => theme.newTheme.density.md};
  font-size: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  list-style-type: none;
  text-decoration: none;

  color: ${({ theme, active }) =>
    active
      ? theme.newTheme.color["Colors/Text/text-brand-primary (900)"]
      : "inherit"};
  background-color: ${({ active, theme }) =>
    active ? theme.newTheme.color["Colors/Background/bg-tertiary"] : "none"};

  &:hover {
    cursor: pointer;
  }
`

export const DropdownWrapper = styled.div`
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

export const Action = styled(Tab)`
  width: ${({ theme }) => theme.newTheme.density.md};
  display: flex;
  align-items: center;
  line-height: 0;
`
