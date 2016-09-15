import _ from 'lodash';
import React from 'react';
import { SmartComponent } from 'esp-js-react';
import { RegionModel, RegionModelRegistration } from '../../model';
import WorkspaceItemContainer from './workspaceItemContainer.jsx';

export default class WorkspaceRegionView extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    model: React.PropTypes.object
  };

  render() {
    let model : RegionModel = this.props.model;
    return (
      <div className={this.props.className}>
        <div className='workspace-region'>
          {
            model.modelRegistrations.length > 0
              ? this._renderWorkspaceItems(model.modelRegistrations)
              : <div className='workspace-region__icon--loading'><i className='fa fa-5x fa-cog fa-spin'/></div>
          }
        </div>
      </div>);
  }

  _renderWorkspaceItems(modelRegistrations:Array<RegionModelRegistration>) {
    return _.map(modelRegistrations, (modelRegistration:RegionModelRegistration) => {
      return (
        <WorkspaceItemContainer
          key={modelRegistration.model.modelId}>
          <SmartComponent modelId={modelRegistration.model.modelId} viewContext={modelRegistration.displayContext} />
        </WorkspaceItemContainer>
      );
    }).concat(_.times(6, i => <div key={i} className='workspace-region__spacer'/>)); // add empty items at the end so tiles lay out nicely
  }
}
