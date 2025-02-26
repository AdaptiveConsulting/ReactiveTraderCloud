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
`

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0.75;

  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
`

export const ModalPanel = styled.div`
  padding: ${({ theme }) => theme.newTheme.spacing["4xl"]};
  margin: 0 1rem;
  border-radius: ${({ theme }) => theme.newTheme.radius.lg};

  width: max-content;
  min-width: 16rem;
  max-width: 40rem;

  position: relative;
  z-index: 1;

  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};

  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem
      ${(props) =>
        darken(
          0.1,
          props.theme.newTheme.color["Colors/Background/bg-primary"],
        )};
`

export const Header = styled.div`
  padding-bottom: ${({ theme }) => theme.newTheme.spacing.xs};
  border-bottom: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Text/text-primary (900)"]};
`

export const Body = styled.div`
  margin: 1rem 0;
`
