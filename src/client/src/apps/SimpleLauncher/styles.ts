import { styled } from 'rt-theme'
import { rules } from 'rt-styleguide'
import { createGlobalStyle } from 'styled-components'

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
  background-color: ${({ theme }) => theme.core.lightBackground};
  overflow: hidden;
  color: ${({ theme }) => theme.core.textColor};
`

export const RootLauncherContainer = styled(RootContainer) <{ showResponsePanel: boolean }>`
  background-color: ${({ showResponsePanel }) => showResponsePanel ? '#313131' : 'transparent'};
  border-radius: 3px;
  overflow: hidden;
`

export const LauncherContainer = styled(RootContainer) <{ width: number, showResponsePanel: boolean }>`
  height: 56px;
  width: ${({ showResponsePanel, width }) => showResponsePanel ? width + 'px' : '355px'};
  border-radius: ${({ showResponsePanel }) => showResponsePanel ? '3px 3px 0 0' : '3px'};
  background-color: #313131;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  overflow: initial;
  transition: width 0.3s ease-out;
  will-change: contents;
`

export const HorizontalContainer = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

export const IconContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &:hover {
    span {
      color: ${({ theme }) => theme.core.textColor};
    }
  }
`

export const ButtonContainer = styled(IconContainer)`
  display: flex;
  align-items: center;
  height: auto;
  ${rules.appRegionNoDrag};
`

export const SearchButtonContainer = styled(ButtonContainer) <{ isSearchVisible: boolean }>`
  display: flex;
  align-items: center;
  height: auto;
  width: 40px;
  border-radius: 0 3px 3px 0;
  ${rules.appRegionNoDrag};
  background-color: ${({ isSearchVisible }) => isSearchVisible ? '#8c7ae6' : ''};
`

export const LogoContainer = styled(IconContainer)`
  width: 50%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }
  ${rules.appRegionDrag};
`

export const ExitButton = styled.button`
  border-bottom: 1px solid rgba(216, 216, 216, 0.15);
  padding-top: 3px;
  &:hover {
    svg path:last-child {
      fill: #5f94f5;
    }
  }
`

export const MinimiseButton = styled.button`
  padding-bottom: 3px;
  &:hover {
    svg path:last-child {
      fill: #5f94f5;
    }
  }
`

export const MinExitContainer = styled(ButtonContainer)`
  width: 30%;
  height: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-left: 1px solid rgba(216, 216, 216, 0.15);
  padding-left: 4px;
  margin-right: 4px;
`

export const LogoLauncherContainer = styled(IconContainer)`
  width: 50%;
  min-width: 56px;
  background-color: #313131;
  border-right: 1px solid rgba(216, 216, 216, 0.15);
  height: 80%;
  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }
  ${rules.appRegionDrag};
`
