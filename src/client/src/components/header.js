import React from 'react';



class Header extends React.Component {
  render(){
    return <nav className='navbar navbar-default'>
      <a className='navbar-brand' href='/'>ReactiveTrader</a>
      <ul className='nav navbar-nav hidden-xs navbar-left'>
        <li>
          <a href='/admin' className='nav-link' activeClassName='active'>Admin Cluster</a>
        </li>
      </ul>
      <ul className="nav navbar-nav pull-right">
        <li><a href="#" name='status'>{this.props.status}</a></li>
      </ul>
    </nav>
  }
}


export default Header;
