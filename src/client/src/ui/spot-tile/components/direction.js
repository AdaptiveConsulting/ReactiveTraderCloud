import React from 'react';

const Direction = props => <div className={props.direction + ' direction'}>{props.spread}</div>;

Direction.propTypes ={
  direction: React.PropTypes.string.isRequired,
  spread: React.PropTypes.string.isRequired
}

export default Direction;
