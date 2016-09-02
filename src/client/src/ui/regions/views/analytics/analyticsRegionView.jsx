import React from 'react';
import classnames from 'classnames';
import { RegionModel } from '../../model';
import SingleItemRegionView from '../singleItem/singleItemRegionView.jsx';
import './analyticsRegionView.scss';

export default class AnalyticsRegionView extends SingleItemRegionView {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let innerContent = null;

    let model:RegionModel = this.props.model;

    if (model.modelRegistrations.length === 1) {
      let className = classnames('analyticsRegion__content', { 'analyticsRegion__container--no-content' : !model.showContent});
      innerContent = this._createRootElement(model, className);
    }

    let analyticsClassName = classnames (
      'analyticsRegion__element-button glyphicon glyphicon-stats',
      {
        'analyticsRegion__element--active': innerContent !== null && model.showContent,
        'analyticsRegion__element--inactive' :  innerContent === null || !model.showContent
      }
    );
    return (
      <div className={this.props.className}>
        {innerContent}
        <div className='analyticsRegion__container'>
          <i className={analyticsClassName} onClick={() => this.props.router.publishEvent(this.props.model.modelId, 'toggleShowContent', {})} />
          <div className='analyticsRegion__element'></div>
        </div>
      </div>
    );
  }
}
