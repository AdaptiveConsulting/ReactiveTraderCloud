import { Router, observeEvent } from 'esp-js/src';
import { logger } from '../../../../system';
import { ModelBase } from '../../../common';
import { getComponentForModel } from '../';
import { PopoutRegistration } from './';

var _log:logger.Logger = logger.create('PopoutRegionModel');

export default class PopoutRegionModel extends ModelBase {

  popouts:Array<PopoutRegistration>;

  constructor(router:Router) {
    super('popoutRegionModelId', router);
    this.popouts = [];
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Popout region started`);
  }

  addToRegion(model:ModelBase, context:?string) {
    this.router.runAction(this.modelId, ()=>{
      let view = getComponentForModel(model);
      this.popouts.push(new PopoutRegistration(
        view,
        model.modelId
      ));
    });
  }

  removeFromRegion(modelId:string) {

  }
}
