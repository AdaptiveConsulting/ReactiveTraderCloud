/**
 * These esp model Ids are well known and never change, i.e. the models are singleton.
 *
 * Other models, like the spot tiles are created dynamically.
 */
export default class WellKnownModelIds {

  static get workspaceRegionModelId(): string {
    return 'workspaceRegionModelId'
  }

  static get popoutRegionModelId(): string {
    return 'popoutRegionModelId'
  }

  static get sidebarRegionModelId(): string {
    return 'sidebarRegionModelId'
  }

  static get blotterRegionModelId(): string {
    return 'blotterRegionModelId'
  }

  static get shellModelId(): string {
    return 'shellModelId'
  }

  static get footerModelId(): string {
    return 'footerModelId'
  }

  static get analyticsModelId(): string {
    return 'analyticsModelId'
  }

  static get blotterModelId(): string {
    return 'blotterModelId'
  }

  static get chromeModelId(): string {
    return 'chromeModelId'
  }

  static get sidebarModelId(): string {
    return 'sidebarModelId'
  }
}
