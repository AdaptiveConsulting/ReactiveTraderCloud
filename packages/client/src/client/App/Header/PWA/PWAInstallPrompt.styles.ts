import styled from "styled-components"

export const MainBanner = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  align-items: center;
  gap: ${({ theme }) => theme.newTheme.spacing.md};
  padding: 0 ${({ theme }) => theme.newTheme.spacing.lg};
  width: 100%;
  height: 32px;
  z-index: 100;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary-solid"]};
`

export const CrossButton = styled.div`
  svg {
    height: 12px;
    stroke: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-primary (900)"]};
  }
  &:hover {
    cursor: pointer;
  }
`
