import React from 'react';

export class HomeView extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    counter: React.PropTypes.number
  }

  render(){
    return (
      <div className='container text-center'>
        Hello
      </div>
    );
  }
}

export default HomeView;
