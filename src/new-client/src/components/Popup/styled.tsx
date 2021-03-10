import styled from "styled-components"

export const PopupContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: absolute;
  z-index: 5;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.core.alternateBackground};
  box-shadow: 0 0.05rem 0.05rem rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem ${(props) => props.theme.overlay.backgroundColor};
`

export const PopupPanel = styled.div<{ minWidth?: string }>`
  width: 100%;
  min-width: ${({ minWidth }) => (minWidth ? minWidth : "16rem")};

  position: relative;
  z-index: 1;

  color: ${({ theme }) => theme.core.textColor};
`

export const Body = styled.div`
  margin: 1rem 0.25rem;
`
