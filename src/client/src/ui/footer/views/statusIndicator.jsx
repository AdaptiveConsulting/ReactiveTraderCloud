import React from 'react';
import classnames from 'classnames';
import './statusIndicator.scss';
import {  ApplicationStatusConst } from '../../../services/model';

export default class StatusIndicator extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    status: React.PropTypes.string.isRequired
  };

  render() {
    let wrapperStatusCssLookup = {
      [ApplicationStatusConst.Healthy]: 'status-indicator--healthy',
      [ApplicationStatusConst.Warning]: 'status-indicator--warning',
      [ApplicationStatusConst.Down]:    'status-indicator--down',
      [ApplicationStatusConst.Unknown]: ''
    };
    let iconStatusCssLookup = {
      [ApplicationStatusConst.Healthy]: 'fa fa-check',
      [ApplicationStatusConst.Warning]: '',
      [ApplicationStatusConst.Down]:    'fa fa-times',
      [ApplicationStatusConst.Unknown]: ''
    };
    let wrapperClasses = classnames('status-indicator', this.props.className, wrapperStatusCssLookup[this.props.status]);
    let iconClasses = classnames('status-indicator__icon', iconStatusCssLookup[this.props.status]);
    return (
      <div className={wrapperClasses}>
        <i className={iconClasses}></i>
      </div>
    );
  }
}
