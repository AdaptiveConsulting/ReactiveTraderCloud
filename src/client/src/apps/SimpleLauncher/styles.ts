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
  background-color: #313131;
  overflow: hidden;
  color: ${({ theme }) => theme.core.textColor};
`

export const RootLauncherContainer = styled(RootContainer)`
  border-radius: 3px;
  transition: all 0.2s ease-out;
  will-change: contents;
`

export const RootResultsContainer = styled.div`
  padding: 5px;
`

export const LauncherContainer = styled.div<{ showResponsePanel: boolean }>`
  max-height: 56px;
  height: 100%;
  width: 100%;
  background-color: #313131;
  display: flex;
  align-items: center;
  border-radius: ${({ showResponsePanel }) => showResponsePanel && '3px 3px 0 0'};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`

export const IconContainer = styled.div`
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

export const LogoLauncherContainer = styled(IconContainer)`
  width: 50%;
  min-width: 56px;
  border-right: 1px solid rgba(216, 216, 216, 0.15);
  height: 70%;

  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }

  .svg-icon--active {
    fill: #8c7ae6;
    transition: fill 0.2s ease-in-out;
  }
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
  background-color: ${({ isSearchVisible }) => (isSearchVisible ? '#8c7ae6' : '')};
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
  height: 70%;
  border-left: 1px solid rgba(216, 216, 216, 0.15);
  padding-left: 4px;
  margin-right: 4px;
`
