import styled, { createGlobalStyle, css } from "styled-components"

const appRegionDrag = css`
  -webkit-touch-callout: none;
  -webkit-user-drag: none;
  user-select: none;
  cursor: default;
  -webkit-user-drag: none;
  -webkit-app-region: drag;
`

const appRegionNoDrag = css`
  -webkit-user-drag: none;
  -webkit-app-region: no-drag;
`

export const LauncherGlobalStyle = createGlobalStyle`
:root, body {
  @media all {
    font-size: 16px;
    -webkit-app-region: drag;
  }
}
`

export const RootContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
`

export const RootLauncherContainer = styled(RootContainer)`
  border-radius: 3px;
  transition: all 0.2s ease-out;
  will-change: contents;
`

export const RootResultsContainer = styled.div`
  padding: 0;

  ${appRegionNoDrag}
`

export const LauncherContainer = styled.div<{ showResponsePanel: boolean }>`
  max-height: 56px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  display: flex;
  align-items: center;
  border-radius: ${({ showResponsePanel }) =>
    showResponsePanel && "3px 3px 0 0"};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  position: relative;
`

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const LogoLauncherContainer = styled(IconContainer)`
  min-width: 56px;
  border-right: 1px solid rgba(216, 216, 216, 0.15);
  height: 70%;
  flex-shrink: 0;
  flex-grow: 0;

  ${appRegionDrag};
`

export const IconTitle = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  font-size: 9px;
  font-family: Lato;
  color: transparent;
  transition: color 0.3s ease;

  /* avoids text highlighting on icon titles */
  user-select: none;
`

export const ButtonContainer = styled(IconContainer)`
  width: 100%;
  ${appRegionNoDrag};
`

export const SearchButtonContainer = styled(ButtonContainer)<{
  isSearchVisible: boolean
}>`
  height: auto;
  width: 40px;
  border-radius: 0 3px 3px 0;
  background-color: ${({ isSearchVisible, theme }) =>
    isSearchVisible
      ? theme.newTheme.color["Colors/Background/bg-secondary"]
      : ""};
  ${appRegionNoDrag};
`

export const LogoContainer = styled(IconContainer)`
  width: 50%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  .svg-icon {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
  }
  ${appRegionDrag};
`

const controlButtonHoverStyle = css`
  &:hover {
    svg path:last-child {
      fill: ${({ theme }) =>
        theme.newTheme.color["Colors/Background/bg-brand-primary"]};
    }
  }
`
export const ExitButton = styled.button`
  border-bottom: 1px solid rgba(216, 216, 216, 0.15);
  padding-top: 3px;
  ${controlButtonHoverStyle}
`

export const MinimiseButton = styled.button`
  padding-bottom: 3px;
  ${controlButtonHoverStyle}
`

export const MinExitContainer = styled(ButtonContainer)`
  width: 30%;
  height: 70%;
  border-left: 1px solid rgba(216, 216, 216, 0.15);
  padding-left: 4px;
  margin-right: 4px;
`

export const SearchContainer = styled.div<{ visible?: boolean }>`
  position: absolute;
  left: 350px;
  right: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  z-index: 1;
  transition:
    left 0.3s,
    right 0.3s,
    opacity 0.1s ease;
  will-change: opacity;

  ${({ visible }) =>
    visible
      ? `
  left: 55px;
  opacity: 1;
  right: 93px;

  > input {
    caret-color: #5f94f5;
    padding-left: 9px;
  }
  `
      : ``}
`

export const Input = styled.input`
  width: 100%;
  height: 45px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  outline: none;
  border-radius: 3px 0 0 3px;
  font-size: 1rem;
  font-weight: 400;
  caret-color: transparent;
  transition: all 0.3s ease;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};

  &::placeholder {
    opacity: 0.6;
  }
`

export const CancelButton = styled.button`
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  cursor: pointer;
  z-index: 2;

  svg {
    path:last-child {
      fill: ${({ theme }) => theme.secondary[1]};
    }
  }
`

export const Response = styled.div`
  font-size: 1rem;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  padding: 0.75rem;
`

export const OverlayContainer = styled.div`
  width: 100%;
  max-width: 100%;
  position: absolute;
  z-index: 9;
  top: 0;
`
