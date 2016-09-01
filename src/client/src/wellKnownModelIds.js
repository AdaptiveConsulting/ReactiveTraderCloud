/**
 * These esp model Ids are well known and never change, i.e. the models are singleton.
 *
 * Other models, like the spot tiles are created dynamically.
 */
export default class WellKnownModelIds {

  static get workspaceRegionModelId() {
    return 'workspaceRegionModelId';
  }

  static get popoutRegionModelId() {
    return 'popoutRegionModelId';
  }

  static get analyticsRegionModelId() {
    return 'analyticsRegionModelId';
  }

  static get blotterRegionModelId() {
    return 'blotterRegionModelId';
  }

  static get shellModelId() {
    return 'shellModelId';
  }

  static get headerModelId() {
    return 'headerModelId';
  }

  static get footerModelId() {
    return 'footerModelId';
  }

  static get analyticsModelId() {
    return 'analyticsModelId';
  }

  static get blotterModelId() {
    return 'blotterModelId';
  }

  static get chromeModelId() {
    return 'chromeModelId';
  }

  static get sidebarModelId() {
    return 'sidebarModelId';
  }
}
