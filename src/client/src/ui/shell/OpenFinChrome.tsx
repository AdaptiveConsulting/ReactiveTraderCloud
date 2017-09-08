import * as React from 'react'
import './OpenFinChromeStyles.scss'
import * as classnames from 'classnames'

interface OpenFinChromeProps {
  children: any
  minimize?: () => {}
  maximize?: () => {}
  close: () => {}
  openFin: any
  showHeaderBar?: boolean,
}

export default class OpenFinChrome extends React.Component<OpenFinChromeProps, {}> {
  props
  render() {
    const headerClasses = classnames('openfin-chrome__header', {
      'openfin-chrome__header--no-bar' : this.props.showHeaderBar === false,
      'openfin-chrome__header--with-bar' : this.props.showHeaderBar !== false,
    })
    const contentClasses = classnames('openfin-chrome__content', {
      'openfin-chrome__content--no-header-bar' : this.props.showHeaderBar === false,
    })
    return (
      <div className="openfin-chrome">
        <div className={headerClasses}>
          <div className="openfin-chrome__header-title"><span className="openfin-chrome__header-title-label">Adaptive&#39; Reactive Trader</span></div>
          <div className="openfin-chrome__header-controls-container">
            <ul className="openfin-chrome__header-controls">
              {this.props.minimize ? <li className="openfin-chrome__header-control"><a onClick={() => this.props.minimize()}><i className="fa fa-minus fa-set-position"></i></a></li> : null}
              {this.props.maximize ? <li className="openfin-chrome__header-control"><a onClick={() => this.props.maximize()}><i className="fa fa-square-o"></i></a></li> : null}
              <li className="openfin-chrome__header-control openfin-chrome__header-control--close"><a onClick={() => this.props.close()}><i className="fa fa-close"></i></a></li>
            </ul>
          </div>
        </div>
        <div className={contentClasses}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
