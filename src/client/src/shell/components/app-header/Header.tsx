import React, { FC, useState, useEffect } from 'react'

import { styled, ThemeName, useTheme } from 'rt-theme'

import Logo from './Logo'
import { onGlueLoaded } from '../../../rt-components/platform/adapters/glue/glue'

export const Header: FC = ({ children }) => {
  const [
    { isStackAllButtonVisible, isTabAllButtonVisible, isToggleCollapseButtonVisible },
    setButtonsVisibility,
  ] = useState({
    isStackAllButtonVisible: false,
    isTabAllButtonVisible: false,
    isToggleCollapseButtonVisible: false,
  })

  useEffect(
    () =>
      onGlueLoaded(() =>
        window.glue.agm.register(
          'toggleHeaderButtons',
          // TODO expose toggleHeaderButtons?
          // @ts-ignore temporarily
          (args: { numberOfOpenedWindows: number }) => {
            setButtonsVisibility({
              isStackAllButtonVisible: args.numberOfOpenedWindows > 1,
              isTabAllButtonVisible: args.numberOfOpenedWindows > 1,
              isToggleCollapseButtonVisible: args.numberOfOpenedWindows > 0,
            })
          },
        ),
      ),
    [],
  ) // empty array means componentDidMount

  // TODO expose onClick, stackAll, tabAll and toggleCollapse?
  const onClick = () =>
    !window.glue
      ? window.open('https://weareadaptive.com/')
      : window.glue.windows.open('adaptiveName', 'https://weareadaptive.com/', {
          title: 'my title',
        } as any) // TODO remove as any when typings for glue.windows.open() are fixed

  const stackAll = () =>
    onGlueLoaded(() => {
      window.glue.agm.invoke('stackAllWindows')
    })

  const tabAll = () =>
    onGlueLoaded(() => {
      window.glue.agm.invoke('tabAllWindows')
    })

  const toggleCollapse = () =>
    onGlueLoaded(() => {
      window.glue.agm.invoke('toggleCollapse')
    })

  return (
    <Root>
      <Logo size={1.75} onClick={onClick} />

      <Fill />
      {isStackAllButtonVisible && (
        <IconButton onClick={stackAll} title="Stack All">
          <i className="fas fa-layer-group" />
        </IconButton>
      )}
      {isTabAllButtonVisible && (
        <IconButton onClick={tabAll} title="Tab All">
          <i className="fas fa-window-restore" />
        </IconButton>
      )}
      {isToggleCollapseButtonVisible && (
        <IconButton onClick={toggleCollapse} title="Toggle Collapse">
          <i className="fas fa-minus" />
        </IconButton>
      )}
      <ThemeControl />
      {children != null && (
        <React.Fragment>
          <Division />
          {children}
        </React.Fragment>
      )}
    </Root>
  )
}

const ThemeControl = () => {
  const { themeName, toggleTheme } = useTheme()
  return (
    <IconButton onClick={toggleTheme}>
      <i className={`fa${themeName === ThemeName.Light ? 'r' : 's'} fa-lightbulb`} />
    </IconButton>
  )
}

const Root = styled.div`
  width: 100%;
  max-width: 100%;

  min-height: 3.5rem;
  max-height: 3.5rem;

  padding: 0 1rem;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};

  position: relative;
  z-index: 10;

  box-shadow: 0 0.125rem 0 ${({ theme }) => theme.core.darkBackground};
`

const Fill = styled.div`
  flex: 1;
  height: calc(3.5rem - 5px);
  margin-top: 5px;
  /**
    TODO 8/22 extract this extension of header, and the fill outside header layout
  */
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  cursor: pointer;

  transition: background-color ${({ theme }) => theme.motion.duration}ms
    ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.active.backgroundColor};
    color: ${({ theme }) => theme.button.secondary.textColor};
  }
`

const Division = styled.div`
  height: 100%;
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    display: block;
    width: 0.125rem;
    height: 100%;
    margin-right: -0.125rem;
    background-color: ${props => props.theme.core.darkBackground};
  }
`

export default Header
