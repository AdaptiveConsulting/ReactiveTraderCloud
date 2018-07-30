import { DateFilter, NumberFilter } from 'ag-grid'
// import { Column, FilterManager, FilterWrapper, Promise, Utils as _ } from "ag-grid";

const getFilterSelect = (filter: NumberFilter | DateFilter) => {
  const defaultFilterTypes = filter.getApplicableFilterTypes()
  const restrictedFilterTypes = filter.filterParams.filterOptions
  const actualFilterTypes = restrictedFilterTypes ? restrictedFilterTypes : defaultFilterTypes

  const optionsHtml: string[] = actualFilterTypes.map(filterType => {
    const localeFilterName = filter.translate(filterType)
    return `<option value="${filterType}">${localeFilterName}</option>`
  })
  const readOnly = optionsHtml.length === 1 ? 'disabled' : ''

  const selector =
    optionsHtml.length <= 0
      ? ''
      : `<div class="filter-container__selector-wrapper">
       <select class="filter-container__select" id="filterType" ${readOnly}>
            ${optionsHtml.join('')}
            
        </select>
        <div class="select_arrow"></div>
    </div>`

  return selector
}

// Numeric filter layout override to add a tab on top of the content
NumberFilter.prototype.bodyTemplate = function() {
  const translate = this.translate.bind(this)

  const selector = getFilterSelect(this)

  return `<div class="filter-container">
            <div class="filter-container__tab">
              <div class="filter-container__tab-icon"></div>
            </div>
            <div class="filter-container__content-wrapper">
              <div>
               ${selector}
               
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

NumberFilter.prototype.generateFilterHeader = function() {
  return ''
}

// Date filter override
DateFilter.prototype.bodyTemplate = function() {
  const selector = getFilterSelect(this)
  return `<div class="filter-container">
            <div class="filter-container__tab">
              <div class="filter-container__tab-icon"></div>
            </div>
            <div class="filter-container__content-wrapper">
              <div>
               ${selector}
            </div>
             <div class="ag-filter-date-from" id="filterDateFromPanel"/>
              <div class="ag-filter-date-to" id="filterDateToPanel"/>
              </div>
              </div>`
}

DateFilter.prototype.generateFilterHeader = function() {
  return ''
}
