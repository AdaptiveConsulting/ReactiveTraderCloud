import { createGlobalStyle, css } from 'styled-components/macro'
import styled from 'styled-components/macro'
import { rules } from 'rt-styleguide'

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
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
`

export const RootLauncherContainer = styled(RootContainer)`
  border-radius: 3px;
  transition: all 0.2s ease-out;
  will-change: contents;
`

export const RootResultsContainer = styled.div`
  padding: 0;
`

export const LauncherContainer = styled.div<{ showResponsePanel: boolean }>`
  max-height: 56px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  display: flex;
  align-items: center;
  border-radius: ${({ showResponsePanel }) => showResponsePanel && '3px 3px 0 0'};
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
  width: 50%;
  min-width: 56px;
  border-right: 1px solid rgba(216, 216, 216, 0.15);
  height: 70%;

  ${rules.appRegionDrag};
`

export const IconTitle = styled.span`
  position: absolute;
  bottom: 2px;
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
  ${rules.appRegionNoDrag};
`

export const SearchButtonContainer = styled(ButtonContainer)<{ isSearchVisible: boolean }>`
  height: auto;
  width: 40px;
  border-radius: 0 3px 3px 0;
  background-color: ${({ isSearchVisible }) => (isSearchVisible ? '#5f94f5' : '')};
  ${rules.appRegionNoDrag};
`

export const LogoContainer = styled(IconContainer)`
  width: 50%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }
  ${rules.appRegionDrag};
`

const controlButtonHoverStyle = css`
  &:hover {
    svg path:last-child {
      fill: #5f94f5;
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
