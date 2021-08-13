import styled from "styled-components"

export const OverlayDiv = styled.div<{
  top?: number | string
  left?: number | string
}>`
  top: ${({ top }) => top ?? 0};
  left: ${({ left }) => left ?? 0};
  z-index: 2;
  width: 100%;
  height: 100%;
`
