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
    if(!model.hasContent) {
      return null;
    }
    let className = classnames(
      'sidebar-region__content',
      { 'sidebar-region__container--no-content' : model.isCollapsed }
    );
    let modelRegistration:RegionModelRegistration = this.props.model.modelRegistrations[0];
    let innerContent = (
      <div className={className}>
        <SmartComponent modelId={modelRegistration.model.modelId} viewContext={modelRegistration.displayContext} />
      </div>
    );
    let buttonClassName = classnames (
      'sidebar-region__element-button glyphicon glyphicon-stats',
      {
        'sidebar-region__element--active': innerContent !== null && !model.isCollapsed,
        'sidebar-region__element--inactive' :  innerContent === null || model.isCollapsed
      }
    );
    return (
      <div className={this.props.className}>
        {innerContent}
        <div className='sidebar-region__container'>
          <i className={buttonClassName} onClick={() => this.props.router.publishEvent(this.props.model.modelId, 'toggleIsCollapsed', {})} />
          <div className='sidebar-region__element'></div>
        </div>
      </div>
    );
  }
}
