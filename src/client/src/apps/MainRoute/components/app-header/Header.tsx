import React, { useCallback } from 'react'
import { styled } from 'rt-theme'
import LoginControls from './LoginControls'
import Logo from './Logo'

const Header: React.FC = ({ children }) => {
  const onLogoClick = useCallback(() => window.open('https://weareadaptive.com/'), [])

  return (
    <Root>
      <Logo size={1.75} onClick={onLogoClick} data-qa="header__root-logo" />
      <Fill />
      <LoginControls />
      {children == null ? null : (
        <React.Fragment>
          <Division />
          {children}
        </React.Fragment>
      )}
    </Root>
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
