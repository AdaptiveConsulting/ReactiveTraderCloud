import styled from "styled-components"

export const MainBanner = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  width: 100%;
  height: 32px;
  z-index: 100;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary-solid"]};
`

export const CrossButton = styled.div`
  color: ${({ theme }) => theme.color["Colors/Text/text-primary_alt"]};
  svg {
    height: 10px;
  }
  &:hover {
    cursor: pointer;
  }
`
