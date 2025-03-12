import styled from "styled-components"

export const Control = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-self: center;
  border-radius: ${({ theme }) => theme.radius.xxs};

  color: ${(props) =>
    props.theme.color["Colors/Foreground/fg-quaternary (500)"]};

  &:hover {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-primary_hover"]};
    color: ${({ theme }) =>
      theme.color["Colors/Foreground/fg-brand-primary (600)"]};
  }

  &:disabled {
    color: ${({ theme }) => theme.color["Colors/Foreground/fg-disabled"]};
  }
`

export const ControlsWrapper = styled.div`
  display: flex;
`

export const TitleBar = styled.div`
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  min-height: 1.5rem;
  margin: 0;
  height: 100%;
  user-select: none;

  // Required to make application draggable
  // See: https://www.electronjs.org/docs/api/frameless-window#draggable-region
  -webkit-app-region: drag;
`
