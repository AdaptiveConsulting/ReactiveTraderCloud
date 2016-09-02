import { SmartComponent } from 'esp-js-react';
import React from 'react';
import { RegionModel, RegionModelRegistration } from '../../model';
import classnames from 'classnames';

export default class SingleItemRegionView extends React.Component {
  constructor() {
    super();
  }

  static propTypes = {
    className: React.PropTypes.string,
    model:React.PropTypes.object.isRequired
  };

  render() {
    return this._createRootElement(this.props.model, this.props.className);
  }

  _createRootElement(model, containerClassName) {
    if (model.modelRegistrations.length !== 1) {
      let classNames = classnames(containerClassName, 'hide');
      return <div className={classNames}></div>;
    } else {
      let modelRegistration:RegionModelRegistration = model.modelRegistrations[0];
      return (
        <div className={containerClassName}>
          <SmartComponent modelId={modelRegistration.model.modelId} viewContext={modelRegistration.displayContext} />
        </div>
      );
    }
  }
}
