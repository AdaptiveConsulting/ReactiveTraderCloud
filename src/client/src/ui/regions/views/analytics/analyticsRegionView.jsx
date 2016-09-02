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
      innerContent = super.render();
    }

    let analyticsClassName = classnames (
      'sidebar__element-button glyphicon glyphicon-stats',
      {
        'sidebar__element--active': innerContent !== null && model.showContent,
        'sidebar__element--inactive' :  innerContent === null || !model.showContent
      }
    );
    return (
      <div className='sidebar__container'>
        {innerContent}
        <div>
          <i className={analyticsClassName} onClick={() => this.props.router.publishEvent(this.props.model.modelId, 'toggleShowContent', {})} />
          <div className='sidebar__element'></div>
        </div>
      </div>
    );
  }
}
