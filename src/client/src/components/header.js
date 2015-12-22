import React from 'react';
import { Link } from 'react-router';
import system from 'system';
import { model as serviceModel, FakeUserRepository } from 'services';

class Header extends React.Component {

  static propTypes = {
    status: React.PropTypes.bool,
    services: React.PropTypes.object
  }

  componentWillMount() {
    if (window.fin) {
      window.fin.desktop.main(() => this.fin = window.fin.desktop.Window.getCurrent());
    }
  }

  getBrokerStatus(status:boolean) {
    return status
      ? <span className='fa-stack text-success animated fadeIn' title='Online'>
      <i className='fa fa-signal fa-stack-1x'/>
    </span>
      : <span className='fa-stack' title='Connection offline'>
      <i className='fa fa-signal fa-stack-1x'/>
      <i className='fa fa-ban fa-stack-2x text-danger'/>
    </span>;
  }

  getServices(serviceLookup:serviceModel.ServiceStatusLookup) {
    const serviceIndicators = [];

    for (let serviceType in serviceLookup.services) {
      var statusSummary:system.service.ServiceStatus = serviceLookup.services[serviceType];
      if (statusSummary.isConnected) {
        serviceIndicators.push(
          <li
            key={serviceType}
            className='service-status'>
            <i
              className='fa fa-circle '
              title={serviceType + ' ' + statusSummary.connectedInstanceCount + ': nodes online'}
            />
            <i className='node-badge'>{statusSummary.connectedInstanceCount}</i>
          </li>
        );
      } else {
        serviceIndicators.push(
          <li
            key={serviceType}
            className='service-status text-danger animated infinite fadeIn'>
            <i className='fa fa-circle-o' title={serviceType + ' offline'}/>
          </li>
        );
      }
    }
    return serviceIndicators;
  }

  close() {
    this.fin && this.fin.close();
  }

  minimise(e) {
    e && e.preventDefault();
    this.fin && this.fin.minimize();
  }

  maximise(e) {
    e && e.preventDefault();
    if (this.fin) {
      this.fin.getState(state => {
        switch (state) {
          case 'maximized':
          case 'restored':
          case 'minimized':
            this.fin.restore(() => this.fin.bringToFront());
            break;
          default:
            this.fin.maximize();
        }
      });
    }
  }

  handleExternalClick(e) {
    if (window.fin) {
      e.preventDefault();
      window.fin.desktop.System.openUrlWithBrowser(e.currentTarget.href);
    }
  }

  render() {
    const { status, services } = this.props;
    var currentUser = FakeUserRepository.currentUser;
    return (
      <nav className='navbar navbar-default'>
        <a className='navbar-brand navbar-adaptive' href='http://weareadaptive.com/' target='_blank'
           title='Adaptive Home Page' onClick={(e) => this.handleExternalClick(e)}>
          <img src='images/adaptive-logo-statusbar.png' alt='Adaptive Logo'/>
        </a>
        <a className='navbar-brand navbar-adaptive navbar-openfin' href='http://openfin.co/' target='_blank'
           title='Open Fin' onClick={(e) => this.handleExternalClick(e)}>
          <img src='images/openfin-logo.png' alt='OpenFin Logo'/>
        </a>
        <Link className='navbar-brand' to='/' title='Home'>
          Reactive Trader Cloud
        </Link>
        <ul className='nav navbar-nav hidden-xs hidden-sm navbar-left'>
          <li>
            <Link to='/user' className='nav-link' activeClassName='active'>
              <i className='fa fa-user'/>
              {currentUser.code} ({currentUser.name} {currentUser.surname})
            </Link>
          </li>
        </ul>
        <nav className='nav navbar-nav chrome-controls pull-right'>
          <a title='Minimise' onClick={(e) => this.minimise(e)} href='#'>
            <i className='fa fa-minus-square'/>
          </a>
          <a title='Maximise' onClick={(e) => this.maximise(e)} href='#'>
            <i className='fa fa-plus-square'/>
          </a>
          <a title='Close' onClick={() => this.close()} href='#'>
            <i className='fa fa-times'/>
          </a>
        </nav>
        <ul className='nav navbar-nav pull-right nav-status hidden-xs'>
          <li>{this.getBrokerStatus(status)}</li>
          {this.getServices(services)}
        </ul>
      </nav>
    );
  }
}

export default Header;
