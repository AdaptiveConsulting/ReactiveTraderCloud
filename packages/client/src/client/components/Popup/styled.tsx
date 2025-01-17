import styled from "styled-components"

export const PopupContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: absolute;
  z-index: 5;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.newTheme.radius.md};
  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  border: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
`

export const PopupPanel = styled.div<{ minWidth?: string }>`
  width: 100%;
  min-width: ${({ minWidth }) => (minWidth ? minWidth : "16rem")};

  position: relative;
  z-index: 1;
`

export const Body = styled.div`
  margin: 1rem 0.25rem;
`
