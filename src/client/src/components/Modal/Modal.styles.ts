import { darken } from "polished"
import styled from "styled-components"

export const ModalContainer = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0.75;

  background: ${({ theme }) => theme.overlay.backgroundColor};
`

export const ModalPanel = styled.div`
  padding: 1rem 1.5rem;
  margin: 0 1rem;

  width: max-content;
  min-width: 16rem;
  max-width: 40rem;

  position: relative;
  z-index: 1;

  background: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem ${(props) => darken(0.1, props.theme.overlay.backgroundColor)};
`

export const Header = styled.div`
  font-size: 1rem;
  line-height: 3rem;
  box-shadow: 0 1px 0 ${({ theme }) => theme.core.textColor};
`

export const Body = styled.div`
  margin: 1rem 0;
`
