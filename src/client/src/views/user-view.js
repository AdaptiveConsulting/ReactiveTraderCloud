import React from 'react';
import Modal from 'components/modal';
import Header from 'components/header';
import Traders from 'utils/traders';


class UserView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      users: []
    };

  }

  componentWillMount(){
    this.setState({
      users: Traders.list
    });
  }


  render(){
    return <div>
      <div>
        <select>
          {this.state.users.map((trader) => <option value={trader.shortCode}>{trader.firstName} {trader.lastName} ({trader.shortCode})</option>)}
        </select>
      </div>
    </div>;
  }

}

export default UserView;
