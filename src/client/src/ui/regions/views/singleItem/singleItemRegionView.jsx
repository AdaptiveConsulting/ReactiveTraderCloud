import React from 'react';
import { ViewBase } from '../../../common';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel } from '../../';
import classnames from 'classnames';

export default class SingleItemRegionView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  static propTypes = {
    className: React.PropTypes.string
  };

  render() {
    let model:RegionModel = this.state.model;
    if (model === null || model.modelRegistrations.length !== 1) {
      let classNames = classnames(this.props.className, 'hide');
      return <div className={classNames}></div>;
    } else {
      let modelRegistration:RegionModelRegistration = model.modelRegistrations[0];
      let view = createViewForModel(modelRegistration.model, modelRegistration.displayContext);
      return (
        <div className={this.props.className}>
          {view}
        </div>
      );
    }
  }
}
