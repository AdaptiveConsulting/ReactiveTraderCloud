import React from 'react';
import CurrencyPairs from '../components/currency-pairs';
import Blotter from '../components/blotter';

export class IndexView extends React.Component {
  render(){
    return (
      <div className=''>
        <CurrencyPairs />
        <Blotter />
      </div>
    );
  }
}

export default IndexView;
