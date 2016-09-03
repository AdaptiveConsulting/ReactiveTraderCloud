import React from 'react';
import { SmartComponent } from 'esp-js-react';
import { RegionModel, RegionModelRegistration } from '../../model';
import classnames from 'classnames';

export default class SingleItemRegionView extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    model:React.PropTypes.object.isRequired
  };

  render() {
    if (this.props.model.modelRegistrations.length !== 1) {
      let classNames = classnames(this.props.className, 'hide');
      return (<div className={classNames}></div>);
    } else {
      let modelRegistration:RegionModelRegistration = this.props.model.modelRegistrations[0];
      return (
        <div className={this.props.className}>
          <SmartComponent modelId={modelRegistration.model.modelId} viewContext={modelRegistration.displayContext} />
        </div>
      );
    }
  }
}
