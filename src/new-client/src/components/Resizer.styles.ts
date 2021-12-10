import styled from "styled-components"

export const ResizableContent = styled.div<{ horitzontalResize?: boolean }>`
  width: ${({ horitzontalResize }) => (horitzontalResize ? "inherit" : "100%")};
  height: ${({ horitzontalResize }) =>
    horitzontalResize ? "inherit" : "100%"};
  display: ${({ horitzontalResize }) => (horitzontalResize ? "contents" : "")};
  position: ${({ horitzontalResize }) => (horitzontalResize ? "" : "absolute")};
`

export const ResizerStyle = styled.div<{ horitzontalResize?: boolean }>`
  width: 100%;
  height: 100%;
  display: ${({ horitzontalResize }) => (horitzontalResize ? "flex" : "")};
`

export const ResizableSection = styled.div<{
  height?: number
  width?: number
  horitzontalResize?: boolean
}>`
  height: ${({ height }) => (height ? height + "%" : "")};
  width: ${({ width }) => (width ? width + "%" : "")};
  overflow: hidden;
  position: relative;

  display: ${({ horitzontalResize }) => (horitzontalResize ? "flex" : "")};
  justify-content: ${({ horitzontalResize }) =>
    horitzontalResize ? "center" : ""};
  min-width: 372px;
`

export const Bar = styled.div<{ show?: boolean; horitzontalResize?: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  background-color: ${({ theme }) => theme.core.textColor};
  box-shadow: 0 -0.125rem 0 0 ${({ theme }) => theme.core.textColor},
    0 0.125rem 0 0 ${({ theme }) => theme.core.textColor};
  cursor: ${({ horitzontalResize }) =>
    horitzontalResize ? "col-resize" : "row-resize"};
  height: ${({ horitzontalResize }) =>
    horitzontalResize ? "100%" : "0.25rem"};
  width: ${({ horitzontalResize }) => (horitzontalResize ? "0.4rem" : "100%")};
  box-shadow: ${({ horitzontalResize, theme }) =>
    horitzontalResize
      ? ""
      : `0 -0.125rem 0 0 ${theme.core.textColor},0 0.125rem 0 0 ${theme.core.textColor};`};
  opacity: 0.1;
  z-index: 1;

  &:hover {
    box-shadow: 0 -0.125rem 0 0 ${({ theme }) => theme.core.textColor},
      0 0.125rem 0 0 ${({ theme }) => theme.core.textColor};
    opacity: 0.3;
    transition: all 200ms ease-in-out;
  }

  user-select: none;
`

export const ResizableContentHoritzontal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
