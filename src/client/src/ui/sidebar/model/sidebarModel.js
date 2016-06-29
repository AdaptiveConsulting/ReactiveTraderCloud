import { logger } from '../../../system';
import { Router,  observeEvent } from 'esp-js/src';
import { SidebarView } from '../views';
import { ModelBase, RegionManagerHelper } from '../../common';
import { RegionManager, RegionNames, view  } from '../../regions';
import { RegionSettings } from '../../../services/model';
import { WellKnownModelIds } from '../../../';

const _log:logger.Logger = logger.create('SidebarModel');

@view(SidebarView)
export default class SidebarModel extends ModelBase {

  _regionManagerHelper:RegionManagerHelper;
  _regionManager:RegionManager;
  _regionName:string;
  showSidebar:boolean;
  showAnalytics:boolean;

  constructor(modelId:string,
              router:Router,
              regionManager:RegionManager) {
    super(modelId, router);

    this._regionManager = regionManager;
    this._regionName = RegionNames.sidebar;
    this._regionSettings = new RegionSettings('Sidebar', 40, 280, false);
    this._regionManagerHelper = new RegionManagerHelper(this._regionName, regionManager, this, this._regionSettings);
    this.showSidebar = true;
    this.showAnalytics = true;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Sidebar model starting`);
    this._regionManagerHelper.init();

    //observe analytic spanel tearOff event to hide/display the side panel
    this._observeAnalyticsWindowEvents();
  }

  toggleAnalyticsPanel() {
    if (this.showAnalytics) {
      this.router.publishEvent(this.modelId, 'hideAnalytics', {});
    } else {
      this.router.publishEvent(this.modelId, 'showAnalytics', {});
    }
    this.showAnalytics = !this.showAnalytics;
  }

  _observeAnalyticsWindowEvents(){
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.analyticsModelId, 'popOutAnalytics')
        .observe(() => this.router.runAction(this.modelId, ()=> {
          this.showSidebar = false;
        }))
    );
    this.addDisposable(
      this.router
        .getEventObservable(WellKnownModelIds.popoutRegionModelId, 'removeFromRegion')
        .where(({model}) => model.modelId === WellKnownModelIds.analyticsModelId)
        .observe(() => this.router.runAction(this.modelId, () => {
          this.showSidebar = true;
        }))
    );
  }
}
