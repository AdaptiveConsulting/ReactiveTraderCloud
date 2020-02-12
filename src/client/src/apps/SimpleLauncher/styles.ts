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

export const HorizontalContainer = styled.div`
  height: 52px;
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
`

export const MinimiseButton = styled.button`
  padding-bottom: 3px;
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

export const RootLauncherContainer = styled(RootContainer)`
  height: 60px;
  padding-top: 4px;
  border-radius: 3px;
  background-color: #313131;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  overflow: initial;
`
