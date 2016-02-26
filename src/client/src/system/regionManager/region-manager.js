export default class RegionNames {
  static get workspace() {
    return "workspace";
  }

  static get blotter() {
    return "blotter";
  }

  static get analytics() {
    return "analytics";
  }
}

/**
 * Poor mans region manager, acts to separate functional logic from the place it ends up getting displayed.
 *
 * It's 'poor mans' as it hard codes the region names
 */
export default class RegionManaager {

  registerRegion(name:String, onViewAdded: (view:Object) => void) {

  }

  addToWorkspaceRegion() {

  }

  addToBlotterRegion() {

  }

  addToAnalyticsRegions() {

  }
}
