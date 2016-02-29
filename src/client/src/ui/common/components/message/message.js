import React from 'react';
import numeral from 'numeral';
import { time } from 'd3';

// TODO lift this, it's not a 'common' message it's a trade notification and expect an object of shape 'Trade'
export default class Message extends React.Component {

  static propTypes ={
    message: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func
  }

  render(){
    let response  = this.props.message;
    if (!response)
      return false;

    if (response.message){
      return this.lastResponse = (
        <div className='summary-state animated flipInX'>
          {response.message}
        </div>
      );
    }

    let action = response.direction === 'sell' ? 'Sold' : 'Bought';
    let amount = numeral(response.amount).format('0,000,000[.]00');
    return (
      <div className={response.status + ' summary-state animated flipInX'}>
        <span className='key'>{action}</span> {response.pair.substr(0, 3)} {amount}<br/>
        <span className='key'>vs</span> {response.pair.substr(3, 3)}
        <span className='key'>at</span> {response.rate}<br/>
        <span className='key'>{response.formattedValueDate}</span><br/>
        <span className='key'>Trade ID</span> {response.id}
        <a href='#' className='pull-right dismiss-message' onClick={this.props.onClick}>{response.status}</a>
      </div>
    );
  }

}
