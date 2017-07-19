import * as React from 'react';
import './analytics.scss';

class AnalyticsContainer extends React.Component<any, {}> {
  public render() {
    return (
     <div className='analytics__container'>
          <div ref='analyticsInnerContainer'></div>
        </div>
    );
  }
}

export default AnalyticsContainer;