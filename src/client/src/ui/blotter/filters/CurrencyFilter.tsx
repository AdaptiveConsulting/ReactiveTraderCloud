import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './filters.scss'

interface CurrencyFilterProps {
  valueGetter: (node) => any
  filterChangedCallback: () => any
}

export default class CurrencyFilter extends React.Component<CurrencyFilterProps, any> {
  constructor(props) {
    super(props)

    this.state = {
      text: ''
    }
  }

  isFilterActive() {
    return this.state.text !== null && this.state.text !== undefined && this.state.text !== '';
  }

  doesFilterPass(params) {
    return this.state.text.toLowerCase()
      .split(' ')
      .every((filterWord) => {
        return this.props.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0
      })
  }

  getModel() {
    return { value: this.state.text }
  }

  setModel(model) {
    this.state.text = model ? model.value : ''
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

  componentMethod(message) {
    alert(`Alert from PartialMatchFilterComponent ${message}`)
  }

  onChange = (event) => {
    const newValue = event.target.value
    if (this.state.text !== newValue) {
      this.setState({
        text: newValue
      }, () => {
        this.props.filterChangedCallback()
      })

    }
  }

  render() {
    const style = {
      border: '2px solid #22ff22',
      borderRadius: '5px',
      backgroundColor: '#bbffbb',
      width: '200px',
      height: '50px'
    }

    return (
      <div className="filter-container">
        <div className="filter-container__tab">
          <div className="filter-container__tab-icon"></div>
        </div>
      <div style={style}>Filter: <input style={{ height: '20px' }} ref="input" value={this.state.text}
                                        onChange={this.onChange} className="form-control"/></div>
      </div>
    )
  }
}
