import * as AgGrid from 'ag-grid'
import './filters.scss'
// import { Column, FilterManager, FilterWrapper, Promise, Utils as _ } from "ag-grid";

const getFilterSelect = (filter: any) => {
  const defaultFilterTypes = filter.getApplicableFilterTypes()
  const restrictedFilterTypes = filter.filterParams.filterOptions
  const actualFilterTypes = restrictedFilterTypes ? restrictedFilterTypes : defaultFilterTypes;

  const optionsHtml: string[] = actualFilterTypes.map(filterType => {
    const localeFilterName = filter.translate(filterType)
    return `<option value="${filterType}">${localeFilterName}</option>`
  })
  const readOnly = optionsHtml.length === 1 ? 'disabled' : ''

  const selector =  optionsHtml.length <= 0 ?
    '' :
    `<div class="filter-container__selector-wrapper">
       <select class="filter-container__select" id="filterType" ${readOnly}>
            ${optionsHtml.join('')}
            
        </select>
        <div class="select_arrow"></div>
    </div>`

  return selector
}

// Numeric filter layout override to add a tab on top of the content
AgGrid.NumberFilter.prototype.bodyTemplate = function ( ) {
  const translate = this.translate.bind(this)

  const selector = getFilterSelect(this)

  return `<div class="filter-container">
            <div class="filter-container__tab">
              <div class="filter-container__tab-icon"></div>
            </div>
            <div class="filter-container__content-wrapper">
              <div>
               ${ selector }
               
               <input class="ag-filter-filter filter-container__free-text-input" 
                  id="filterText" type="text" placeholder="${translate('filterOoo')}"/>
                </div>
                 <div class="ag-filter-number-to" id="filterNumberToPanel">
                    <input class="ag-filter-filter filter-container__free-text-input" 
                      id="filterToText" type="text" placeholder="${translate('filterOoo')}"/>
               </div>
            </div>
          </div>`
}

AgGrid.NumberFilter.prototype.generateFilterHeader = function ( ) {
  return ''
}

// Date filter override
AgGrid.DateFilter.prototype.bodyTemplate = function ( ) {

  const selector = getFilterSelect(this)
  return `<div class="filter-container">
            <div class="filter-container__tab">
              <div class="filter-container__tab-icon"></div>
            </div>
            <div class="filter-container__content-wrapper">
              <div>
               ${ selector }
            </div>
             <div class="ag-filter-date-from" id="filterDateFromPanel"/>
              <div class="ag-filter-date-to" id="filterDateToPanel"/>
              </div>
              </div>`
}

AgGrid.DateFilter.prototype.generateFilterHeader = function ( ) {
  return ''
}

/*
FilterManager.prototype.getOrCreateFilterWrapper = function(column:Column) {
  let filterWrapper:FilterWrapper = this.cachedFilter(column)

  const createFilterWrapper = (column: Column): FilterWrapper => {
    const filterWrapper: FilterWrapper = {
      column,
      filterPromise: null,
      scope: <any> null,
      guiPromise: Promise.external<HTMLElement>()
    }
    filterWrapper.scope = this.gridOptionsWrapper.isAngularCompileFilters() ? this.$scope.$new() : null
    filterWrapper.filterPromise = this.createFilterInstance(column, filterWrapper.scope)
    this.putIntoGui(filterWrapper)
    return filterWrapper
  }

  const putIntoGUI = (filterWrapper: FilterWrapper): void => {
    const eFilterGui = this.ownerDocument.createElement('div')
    eFilterGui.className = 'ag-filter'
    filterWrapper.filterPromise.then(filter => {
      let guiFromFilter = filter.getGui()
      if (typeof guiFromFilter === 'string') {
        guiFromFilter = _.loadTemplate(<string>guiFromFilter)
      }

      eFilterGui.appendChild(guiFromFilter)

      if (filterWrapper.scope) {
        this.$compile(eFilterGui)(filterWrapper.scope);
        setTimeout(() => filterWrapper.scope.$apply(), 0);
      }

      filterWrapper.guiPromise.resolve(eFilterGui);
    })
  }

  if (!filterWrapper) {
    filterWrapper = createFilterWrapper(column)
    this.allFilters[column.getColId()] = filterWrapper
  }

  return filterWrapper
}
*/

/*
private createFilterWrapper(column: Column): FilterWrapper {
  let filterWrapper: FilterWrapper = {
    column: column,
    filterPromise: null,
    scope: <any> null,
    guiPromise: Promise.external<HTMLElement>()
  };

  filterWrapper.scope = this.gridOptionsWrapper.isAngularCompileFilters() ? this.$scope.$new() : null;

  filterWrapper.filterPromise = this.createFilterInstance(column, filterWrapper.scope);

  this.putIntoGui(filterWrapper);

  return filterWrapper;
}

private putIntoGui(filterWrapper: FilterWrapper): void {
  let eFilterGui = document.createElement('div');
eFilterGui.className = 'ag-filter';
filterWrapper.filterPromise.then(filter=>{
  let guiFromFilter = filter.getGui();

  // for backwards compatibility with Angular 1 - we
  // used to allow providing back HTML from getGui().
  // once we move away from supporting Angular 1
  // directly, we can change this.
  if (typeof guiFromFilter === 'string') {
    guiFromFilter = _.loadTemplate(<string>guiFromFilter);
  }

  eFilterGui.appendChild(guiFromFilter);

  if (filterWrapper.scope) {
    this.$compile(eFilterGui)(filterWrapper.scope);
    setTimeout( () => filterWrapper.scope.$apply(), 0);
  }

  filterWrapper.guiPromise.resolve(eFilterGui);
});
}
*/
