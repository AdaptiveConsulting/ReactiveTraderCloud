import styled from "styled-components"

import { TouchableIntentName } from "@/client/theme"

export const Control = styled.div<{ accent: TouchableIntentName }>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-self: center;

  color: ${(props) =>
    props.theme.newTheme.color["Colors/Foreground/fg-quaternary (500)"]};

  &:hover {
    color: ${({ theme, accent }) =>
      accent === "aware"
        ? theme.newTheme.color["Colors/Foreground/fg-warning-primary"]
        : theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]};
  }

  &:disabled {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-disabled"]};
  }
`

export const ControlsWrapper = styled.div`
  display: flex;
`

export const TitleBar = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: normal;
  min-height: 1.5rem;
  margin: 0;
  font-size: 0.625rem;
  height: 100%;
  user-select: none;

  // Required to make application draggable
  // See: https://www.electronjs.org/docs/api/frameless-window#draggable-region
  -webkit-app-region: drag;
`
