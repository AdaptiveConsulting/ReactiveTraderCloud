import _ from 'lodash';
import { Router, observeEvent } from 'esp-js/src';
import { ReferenceDataService } from '../../../services';
import { CurrencyPairUpdates, CurrencyPairUpdate, UpdateType } from '../../../services/model';
import { logger } from '../../../system';
import { SpotTileFactory } from '../../spotTile';
import { ModelBase } from '../../common';
import { WorkspaceItem } from './';

var _log:logger.Logger = logger.create('WorkspaceModel');

export default class WorkspaceModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _spotTileFactory:SpotTileFactory;
  _workspaceItemsById:Object;
  _isInitialised:boolean;
  workspaceItems:Array<WorkspaceItem>;

  constructor(router:Router, referenceDataService:ReferenceDataService, spotTileFactory:SpotTileFactory) {
    super('workspaceModelId', router);
    this._referenceDataService = referenceDataService;
    this._spotTileFactory = spotTileFactory;
    this._workspaceItemsById = {};
    this._isInitialised = false;
    this.workspaceItems = [];
  }

  @observeEvent('init')
  _onInit() {
    let _this = this;
    if (!_this._isInitialised) {
      _this._isInitialised = true;
      _this.addDisposable(
        _this._referenceDataService.getCurrencyPairUpdatesStream().subscribeWithRouter(
          _this.router,
          _this.modelId,
          (referenceData:CurrencyPairUpdates) => {
            _this._processCurrencyPairUpdate(referenceData.currencyPairUpdates);
          }
        )
      );
    }
  }

  /**
   * Creates spot tiles for each currencyPair
   *
   * It's not really a normal use case to load spot tiles in a trading app based on static data for pairs.
   * In a real app this component wouldn't know much of the children it hosts, it would just get told to display something.
   * For this demo it seems sensible as all the workspace hosts is spot tiles.
   */
  _processCurrencyPairUpdate(currencyPairUpdates:Array<CurrencyPairUpdate>) {
    _log.debug(`Received [${currencyPairUpdates.length}] currency pairs.`);
    let _this = this;

    _.forEach(currencyPairUpdates, (currencyPairUpdate:CurrencyPairUpdate) => {
      let key = currencyPairUpdate.currencyPair.symbol;
      if (currencyPairUpdate.updateType === UpdateType.Added && !_this._workspaceItemsById.hasOwnProperty(key)) {
        let spotTileModel = _this._spotTileFactory.createTileModel(currencyPairUpdate.currencyPair);
        let spotTileView = _this._spotTileFactory.createTileView(spotTileModel.modelId);
        let workspaceItem:WorkspaceItem = new WorkspaceItem(key, spotTileModel.modelId, spotTileView);
        _this._workspaceItemsById[workspaceItem.key] = workspaceItem;
        _this.workspaceItems.push(workspaceItem);
      } else if (currencyPairUpdate.updateType === UpdateType.Removed && _this._workspaceItemsById.hasOwnProperty(key)) {
        let workspaceItem = _this._workspaceItemsById[key];
        delete _this._workspaceItemsById[key];
        let removeAtIndex = this.workspaceItems.indexOf(workspaceItem);
        if (removeAtIndex > -1) {
          this.workspaceItems.splice(removeAtIndex, 1);
        }
        // fire an event at the spot tile model telling it that it's been closed
        _this.router.publishEvent(workspaceItem.modelId, 'tileClosed', {});
      }
    });
  }

  @observeEvent('tearOffWorkspaceItem')
  _onTearoff(e:{itemId:string}) {
    _log.debug(`Tearing off workspace item with id [${e.itemId}].`);

  }
}
