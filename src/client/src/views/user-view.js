import React from 'react';
import Modal from 'components/modal';
import Header from 'components/header';
import Traders from 'utils/traders';


class UserView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      trades: [],
      connected: false,
      services: {}
    };

  }



  render(){
    const services = this.state.services;

    return <div>
      <Modal/>
      <Header status={this.state.connected} services={services} />
      <div>
        <select>
          {Traders.list.map((trader) => {
            <option value={trader.shortCode}>{trader.firstName} {trader.lastName} ({trader.shortCode})</option>
          })}
        </select>
      </div>
    </div>;
  }

}

export default UserView;
