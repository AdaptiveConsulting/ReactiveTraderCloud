import * as AgGrid from 'ag-grid'
import './filters.scss'

AgGrid.NumberFilter.prototype.bodyTemplate = function ( ) {
  const translate = this.translate.bind(this)

  const defaultFilterTypes = this.getApplicableFilterTypes()
  const restrictedFilterTypes = this.filterParams.filterOptions
  const actualFilterTypes = restrictedFilterTypes ? restrictedFilterTypes : defaultFilterTypes;

  const optionsHtml: string[] = actualFilterTypes.map(filterType => {
    const localeFilterName = this.translate(filterType)
    return `<option value="${filterType}">${localeFilterName}</option>`
  })
  const readOnly = optionsHtml.length === 1 ? 'disabled' : ''

  const selector =  optionsHtml.length <= 0 ?
    '' :
    `<div>
       <select class="ag-filter-select" id="filterType" ${readOnly}>
            ${optionsHtml.join('')}
        </select>
    </div>`

  return `<div class="filter-container">
            <div class="filter-container__tab">
              <div class="filter-container__tab-icon"></div>
            </div>
            <div class="filter-container__content-wrapper">
              <div>
               ${ selector }
               <input class="ag-filter-filter" id="filterText" type="text" placeholder="${translate('filterOoo')}"/>
                </div>
                 <div class="ag-filter-number-to" id="filterNumberToPanel">
                    <input class="ag-filter-filter" id="filterToText" type="text" placeholder="${translate('filterOoo')}"/>
                </div>
            </div>
          </div>`
}

AgGrid.NumberFilter.prototype.generateFilterHeader = function ( ) {
  return ''
}
