import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './filters.scss'
import { ColDef, Column, GridApi, InMemoryRowModel, RowNode } from 'ag-grid'

const ALL = 'all'

interface SetFilterProps {
  api: GridApi
  colDef: ColDef
  column: Column
  rowModel: InMemoryRowModel
  valueGetter: (node) => any
  filterChangedCallback: () => any
  reactContainer: any
}

interface SetFilterState {
  text: string
  selectedFreeText: string
  selectedValueSet: {}
}

export default class SetFilter extends React.Component<SetFilterProps, SetFilterState> {

  private container:Element
  private hidePopup: (params:any) => void

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      selectedFreeText: '',
      selectedValueSet: { [ALL]: true }
    }
  }

  componentDidMount() {
    const uniqueValues = Object.values(this.getUniqueValues())
    const initialSelection = uniqueValues.reduce((resultObj, value, index, array) => {
      resultObj[value] = true
      return resultObj
    }, { [ALL]: true })

    this.setState({ selectedValueSet: initialSelection })
  }

  isFilterActive() {

    const filterActive = this.state.text !== null
      && this.state.text !== undefined
      && this.state.text.trim() !== ''
      && this.isListSelectionModified()
    return filterActive
  }

  isListSelectionModified() {
    const uniquOptions = Object.values(this.getUniqueValues())
    const selectedOptions = Object.values(this.state.selectedValueSet)

    // find if any options is unchecked
    const allOptionsSelected = selectedOptions.indexOf(false) === -1
    return uniquOptions.length + 1 /*accounting for All option*/ !== selectedOptions.length || !allOptionsSelected
  }

  doesFilterPass(params) {
    const value = this.props.valueGetter(params.node)
    const doesTextFilterPass = this.state.text.toLowerCase()
      .split(' ')
      .every((filterWord) => {
        return value.toString().toLowerCase().indexOf(filterWord) >= 0
      })

    const doesOptionsFilterPass = !!this.state.selectedValueSet[value]
      || this.state.selectedValueSet[ALL] === true

    return doesTextFilterPass || doesOptionsFilterPass
  }

  getModel() {

    const filterText = this.state.text
    const model = filterText !== undefined && filterText.trim().length === 0 ? undefined : filterText
    return model
  }

  setModel(model) {
    this.setState({ text: model ? model.value : '' })
  }

  afterGuiAttached(params) {
    this.hidePopup = params.hidePopup
    this.focus()
  }

  focus() {
    setTimeout(() => {
      const container = ReactDOM.findDOMNode(this.refs.input) as HTMLElement
      if (container) {
        container.focus()
      }
    })
  }

  onTextChange = (event) => {
    const newValue = event.target.value.toLowerCase()

    const setFilterOptions = { ...this.state.selectedValueSet }
    const keys = Object.keys(setFilterOptions)
    keys.forEach((key:string) => {
      if (key === ALL) {
        setFilterOptions[ALL] = newValue.length === 0 ? true : false
      }else {
        setFilterOptions[key] = key.toLowerCase().indexOf(newValue) !== -1
      }
    })

    this.setState({ selectedFreeText: newValue, selectedValueSet: setFilterOptions }, () => this.updateFilter())
  }

  onOptionSelectChange = (event, value: string = ALL) => {
    const target:HTMLInputElement = event.target as HTMLInputElement
    const updatedValueSet = { ...this.state.selectedValueSet }

    if (value === ALL) {
      this.updateAllOptions(target.checked)
      return
    } else {
      updatedValueSet[value] = target.checked
      if (value !== ALL && target.checked === false) {
        updatedValueSet[ALL] = false
      }
    }
    this.setState({ selectedValueSet: updatedValueSet }, () => this.updateFilter())
  }

  updateAllOptions = (isChecked:boolean) => {
    const valueSet = { ...this.state.selectedValueSet }
    for (const key in valueSet) {
      valueSet[key] = isChecked
    }
    this.setState({ selectedValueSet: valueSet }, () => this.updateFilter())
  }

  updateFilter = () => {

    if (!this.isListSelectionModified()) {
      this.setState({
        text: ''
      }, () => {
        this.props.filterChangedCallback()
      })
      return
    }

    const freeText = this.state.selectedFreeText
    const options = this.state.selectedValueSet
    const newSelectedValueSet = [freeText]
    for (const key in options) {
      if (options[key] === true) {
        newSelectedValueSet.push(key)
      }
    }
    const newFilterText = newSelectedValueSet.join(' ')
    this.setState({
      text: newFilterText
    }, () => {
      this.props.filterChangedCallback()
    })
  }

  getUniqueValues = ():any[] => {

    const uniqueValuesMap = {}
    const rowModel = this.props.api.getModel()
    if (!rowModel) {
      return []
    }
    rowModel.forEachNode((rowNode:RowNode) => {
      const value = this.props.valueGetter(rowNode)
      uniqueValuesMap[value] = value
    })
    return Object.values(uniqueValuesMap)
  }

  isOptionsChecked = (value:string):boolean => {
    if (Object.keys(this.state.selectedValueSet).length === 0) {
      return true
    }
    return !!this.state.selectedValueSet[value] || this.state.selectedValueSet[ALL] === true
  }

  createOptionItem = (value:string, label:string) => {
    return <div key={value} className="filter-container__checkbox-container">
      <input key={value}
             type="checkbox"
             className="filter-container__checkbox"
             checked={this.isOptionsChecked(value)}
             onChange={(event) => this.onOptionSelectChange(event, value)}/>
      <label>{label || value}</label>
    </div>
  }

  setupContainer = (el:Element) => {
    this.container = ReactDOM.findDOMNode(el)
  }

  render() {
    const uniqueValues = this.getUniqueValues()
    const setOptions = uniqueValues.map((value:string) => {
      return this.createOptionItem(value, value)
    })
    return (
      <div className="filter-container"
           ref={(el) => this.setupContainer(el)}>
        <div className="filter-container__tab">
          <div className="filter-container__tab-icon"></div>
        </div>
        <div className="filter-container__content-wrapper">
          <input key="searchInput"
                 ref="input"
                 placeholder="Search"
                 value={this.state.selectedFreeText}
                 onChange={this.onTextChange}
                 className="filter-container__free-text-input"/>

          <div className="filter_container__select-all-option-container">
            { this.createOptionItem(ALL, 'Select All')}
          </div>
          <div className="filter_container__option-items-wrapper">
            <div className="filter_container__option-items-container">
              { setOptions }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
