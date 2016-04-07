import _ from 'lodash';
import React from 'react';
import { ViewBase } from '../../../common';
import { PageContainer } from '../../../common/components';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel } from '../../';
import { router } from '../../../../system';
import Popout from './popout.jsx';

export default class PopoutRegionView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:RegionModel = this.state.model;
    if (model === null) {
      return null;
    }
    let popouts = this._createPopouts(model.modelRegistrations);
    return (
      <div>
        {popouts}
      </div>
    );
  }

  _createPopouts(modelRegistrations:Array<RegionModelRegistration>) {
    return _.map(modelRegistrations, (modelRegistration:RegionModelRegistration) => {
      let view = createViewForModel(modelRegistration.model, modelRegistration.context);
      let popupAttributes = {
        key: modelRegistration.key,
        url:'/popout',
        title:'',
        onClosing: () => this._popoutClosed(this.props.modelId, modelRegistration.model),
        options: {
          width: 332,
          height: 190,
          resizable: 'no',
          scrollable: 'no'
        }
      };
      return (
        <Popout {...popupAttributes}>
          <PageContainer>
            {view}
          </PageContainer>
        </Popout>
      );
    });
  }

  _popoutClosed(regionModelId, model) {
    router.publishEvent(regionModelId, 'removeFromRegion', {model: model})
  }
}
