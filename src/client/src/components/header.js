import React from 'react';

class Header extends React.Component {

  static propTypes = {
    status: React.PropTypes.bool,
    services: React.PropTypes.object
  }

  getBrokerStatus(status:boolean){
    return status ? <span className='fa-stack text-success animated fadeIn' title='Online'><i className='fa fa-signal fa-stack-1x'/></span> : <span className='fa-stack' title='Connection offline'><i className='fa fa-signal fa-stack-1x' /><i className='fa fa-ban fa-stack-2x text-danger'/></span>;
  }

  getServices(services:object){
    const resp = [];
    for (let k in services){
      resp.push(services[k] ? <li className='service-status'><i className='fa fa-circle ' title={k + ' online'} /></li> : <li className='service-status text-danger animated infinite fadeIn'><i className='fa fa-circle-o' title={k + ' offline'} /></li>);
    }

    return resp;
  }

  render(){
    const { status, services } = this.props;

    console.log(this.props);

    return <nav className='navbar navbar-default navbar-fixed-top'>
      <a className='navbar-brand' href='/'>ReactiveTrader</a>
      <ul className='nav navbar-nav hidden-xs navbar-left'>
        <li>
          <a href='/admin' className='nav-link' activeClassName='active'>Admin Cluster</a>
        </li>
      </ul>
      <ul className="nav navbar-nav pull-right nav-status">
        <li>{this.getBrokerStatus(status)}</li>
        {this.getServices(services)}
      </ul>
    </nav>;
  }
}

export default Header;
