import React from 'react';
import { SmartComponent } from 'esp-js-react';
import classnames from 'classnames';
import { SingleItemRegionModel, RegionModelRegistration } from '../../model';
import './sidebarRegionView.scss';

export default class SidebarRegionView extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    model:React.PropTypes.object.isRequired,
    router:React.PropTypes.object.isRequired
  };

  render() {
    let model:SingleItemRegionModel = this.props.model;
    let innerContent = null;

    if (model.modelRegistrations.length === 1) {
      let className = classnames(
        'sidebar-region__content',
        { 'sidebar-region__container--no-content' : !model.showContent }
      );
      let modelRegistration:RegionModelRegistration = this.props.model.modelRegistrations[0];
      innerContent = (
        <div className={className}>
          <SmartComponent modelId={modelRegistration.model.modelId} viewContext={modelRegistration.displayContext} />
        </div>
      );
    }

    let analyticsClassName = classnames (
      'sidebar-region__element-button glyphicon glyphicon-stats',
      {
        'sidebar-region__element--active': innerContent !== null && model.showContent,
        'sidebar-region__element--inactive' :  innerContent === null || !model.showContent
      }
    );
    return (
      <div className={this.props.className}>
        {innerContent}
        <div className='sidebar-region__container'>
          <i className={analyticsClassName} onClick={() => this.props.router.publishEvent(this.props.model.modelId, 'toggleShowContent', {})} />
          <div className='sidebar-region__element'></div>
        </div>
      </div>
    );
  }
}
