import styled from "styled-components"

export const Background = styled.div`
  height: ${({ theme }) => theme.newTheme.density.md};
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
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

const TabText = styled.li(({ theme }) => ({
  ...theme.newTheme.textStyles["Text md/Semibold"],
}))

export const Tab = styled(TabText)<{ active: boolean; isStatic?: boolean }>`
  height: 100%;
  width: ${({ theme }) => theme.newTheme.spacing["9xl"]};
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
    active ? theme.newTheme.color["Colors/Background/bg-primary_alt"] : "none"};

  &:hover {
    cursor: ${({ isStatic }) => (isStatic ? undefined : "pointer")};
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

export const Action = styled(Tab)<{ size: "sm" | "lg" }>`
  width: ${({ theme, size }) =>
    size === "sm" ? theme.newTheme.density.md : "auto"};
  display: flex;
  align-items: center;
  line-height: 0;
`
