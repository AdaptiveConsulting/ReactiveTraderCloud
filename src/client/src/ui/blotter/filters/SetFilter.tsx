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
}

interface SetFilterState {
  text: string
  selectedFreeText: string
  selectedValueSet: {}
}

export default class SetFilter extends React.Component<SetFilterProps, SetFilterState> {
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
    const uniquOptions = Object.values(this.getUniqueValues())
    const selectedOptions = Object.values(this.state.selectedValueSet)
    console.log(' --- uniqueOptions.length, selectedOptions.length : ', uniquOptions.length, selectedOptions.length)
    const filterActive = this.state.text !== null
            && this.state.text !== undefined
            && this.state.text.trim() !== ''
            && (uniquOptions.length + 1 /* counting the 'all' option */) !== selectedOptions.length
    return filterActive
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
    const model = { value: `${this.state.text}` }
    return model
  }

  setModel(model) {
    this.setState({ text: model ? model.value : '' })
  }

  afterGuiAttached(params) {
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
    const newValue = event.target.value
    this.setState({ selectedFreeText: newValue }, () => this.updateFilter())
  }

  onOptionSelectChange = (event, value: string = ALL) => {
    const target:HTMLInputElement = event.target as HTMLInputElement
    const updatedValueSet = { ...this.state.selectedValueSet }

    updatedValueSet[value] = target.checked
    if (value !== ALL && target.checked === false) {
      updatedValueSet[ALL] = false
    }
    this.setState({ selectedValueSet: updatedValueSet }, () => this.updateFilter())
  }

  updateFilter = () => {
    const freeText = this.state.selectedFreeText
    const options = this.state.selectedValueSet

    const newSelectedValueSet = [freeText, ALL]
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

  render() {
    const uniqueValues = this.getUniqueValues()
    const setOptions = uniqueValues.map((value:string) => {
      return this.createOptionItem(value, value)
    })
    return (
      <div className="filter-container">
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
          <div className="filter_container__option-items-container">
            { setOptions }
          </div>
        </div>
      </div>
    )
  }
}
