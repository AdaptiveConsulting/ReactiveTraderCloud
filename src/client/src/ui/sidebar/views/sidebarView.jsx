import React from 'react';
import { ViewBase } from '../../common';
import { SidebarModel } from '../model';
import classnames from 'classnames';
import './sidebar.scss';

export default class SidebarView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:SidebarModel = this.state.model;
    if (!model || !model.showSidebar) {
      return null;
    }

    let buttonClassNames = classnames (
      'sidebar__element-button  glyphicon glyphicon-stats',
      {
        'sidebar__element--active': model.showAnalytics,
        'sidebar__element--inactive' :  !model.showAnalytics
      }
    );

    return (
      <div className='sidebar__container'>
        <div className={buttonClassNames} onClick={() => model.toggleAnalyticsPanel()}/>
        <div className='sidebar__element'></div>
      </div>
    );
  }
}
