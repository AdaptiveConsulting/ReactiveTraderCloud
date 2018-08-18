import classnames from 'classnames'
import React from 'react'
import { css } from 'react-emotion'
import { rules } from 'rt-styleguide'
import { styled, StyledComponent } from 'rt-theme'

interface OpenFinChromeProps {
  children: any
  minimize?: () => {}
  maximize?: () => {}
  close: () => {}
  openFin: any
  showHeaderBar?: boolean
}

export default class OpenFinChrome extends React.Component<OpenFinChromeProps> {
  // What is going on with this props … uh, value?
  props

  render() {
    const headerClasses = classnames('openfin-chrome__header', {
      'openfin-chrome__header--no-bar': this.props.showHeaderBar === false,
      'openfin-chrome__header--with-bar': this.props.showHeaderBar !== false
    })
    const contentClasses = classnames('openfin-chrome__content', {
      'openfin-chrome__content--no-header-bar': this.props.showHeaderBar === false
    })
    return (
      <Root>
        <Header className={headerClasses}>
          <div />
          <div className="openfin-chrome__header-title">
            <span className="openfin-chrome__header-title-label">Adaptive&#39;s Reactive Trader</span>
          </div>
          <ul className="openfin-chrome__header-controls">
            {this.props.minimize ? (
              <HeaderControl
                intent="aware"
                className="openfin-chrome__header-control"
                onClick={() => this.props.minimize()}
              >
                <i className="fas fa-minus fa-set-position" />
              </HeaderControl>
            ) : null}
            {this.props.maximize ? (
              <HeaderControl
                intent="primary"
                className="openfin-chrome__header-control"
                onClick={() => this.props.maximize()}
              >
                <i className="far fa-window-maximize" />
              </HeaderControl>
            ) : null}
            <HeaderControl
              intent="bad"
              className="openfin-chrome__header-control openfin-chrome__header-control--close"
              onClick={() => this.props.close()}
            >
              <i className="fas fa-close" />
            </HeaderControl>
          </ul>
        </Header>
        <div className={contentClasses}>{this.props.children}</div>
      </Root>
    )
  }
}

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 2rem;

  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;

  align-content: center;
  vertical-align: middle;
`

const HeaderControl: StyledComponent<{ intent?: string }> = styled.a`
  background: none;
  color: ${props => props.theme.button.secondary.backgroundColor};

  font-size: 1em;
  min-width: 1em;

  &:hover {
    ${({ intent = 'primary', theme }) => css`
      background: none;
      color: ${theme.button[intent].backgroundColor};
    `};
  }

  position: relative;
  z-index: 20;
  &,
  * {
    ${props => ' ' || rules.userSelectButton};
  }
`

const Root = styled.div`
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  height: 100vh;
  position: relative;
  .shell__splash {
    display: none;
  }

  &:hover {
    .openfin-chrome__header-controls {
      opacity: 1 !important;
      cursor: pointer;
    }
  }

  .openfin-chrome__header--no-bar {
    position: absolute;
    top: 0;
    z-index: 2;
    background: transparent;
    /* 
      when using -webkit-app-region: drag; cursor is overwritten 
      by system settings and the visual result is contradictory
      to function
      
      cursor: move;
    */

    .openfin-chrome__header-controls {
      opacity: 0;
    }
    .openfin-chrome__header-title-label {
      display: none;
    }
  }

  .openfin-chrome__header-title {
    flex: 10;
    margin: 0.25rem auto;
    text-align: center;
    font-weight: bold;
    -webkit-app-region: drag;
  }

  @media (max-width: 400px) {
    .openfin-chrome__header-title-label {
      display: none;
    }
  }

  .openfin-chrome__header-controls {
    display: flex;
    flex: 1;

    align-content: center;
    justify-content: flex-end;

    height: 2rem;
    max-width: 6rem;
    position: relative;
    z-index: 20;
  }

  .openfin-chrome__header-control {
    flex: 1;
    display: inline-block;

    cursor: pointer;

    line-height: 1rem;
    padding: 0.5rem;
  }

  .openfin-chrome__content {
    height: calc(100% - #{3rem});

    &.openfin-chrome__content--no-header-bar {
      height: 100%;
      box-sizing: border-box;
      .spot-tile__controls {
        margin-right: 1rem;
      }
    }

    > div {
      height: 100%;
    }
  }
`
