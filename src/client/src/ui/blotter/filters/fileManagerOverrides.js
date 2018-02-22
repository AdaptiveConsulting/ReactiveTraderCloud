FilterManager.prototype.getOrCreateFilterWrapper = function(column:Column) {
  let filterWrapper:FilterWrapper = this.cachedFilter(column)

  if (!filterWrapper) {
    filterWrapper = createFilterWrapper(column)
    this.allFilters[column.getColId()] = filterWrapper
  }

  return filterWrapper
  }
