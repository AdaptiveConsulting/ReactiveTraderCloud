import React from 'react';
import CurrecnyPairs from '../components/currency-pairs';

export class IndexView extends React.Component {
  render(){
    return (
      <div className='container'>
        <CurrecnyPairs />
      </div>
    );
  }
}

export default IndexView;
