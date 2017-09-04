import * as React from 'react'
import * as numeral from 'numeral'
import { utils } from '../../../system'
import * as classnames from 'classnames'
import './NotionalInputStyles.scss'
import { CurrencyPair }  from '../../../types'

const NUMERAL_FORMAT      = '0,000,000[.]00'
const DOT                 = '.'
const ENTER               = 'Enter'
const CHAR_CODE_DOT       = 46
const CHAR_CODE_0         = 48
const CHAR_CODE_9         = 57
const CHAR_CODE_UNIT_SEP  = 31
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109] // K, M, k, m

const MAX_NOTIONAL_VALUE = 1000000000

export interface NotionalInputProps {
  className: string
  notional: number
  currencyPair: CurrencyPair
  onNotionalInputChange: (value: number) => void
}

export default class NotionalInput extends React.Component<NotionalInputProps, {}> {
  props: NotionalInputProps
  refs: any
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.className !== nextProps.className ||
      this.props.notional !== nextProps.notional ||
      // currencyPair always here
      this.props.currencyPair.symbol !== nextProps.currencyPair.symbol ||
      this.props.onNotionalInputChange !== nextProps.onChange
  }

  render() {
    const { className, currencyPair, notional } = this.props

    const formattedSize = numeral(notional).format(NUMERAL_FORMAT)
    const classes = classnames('notional', className)

    return (
      <div className={classes}>
        <label className="notional__currency-pair">{currencyPair.base}</label>
        <input className="notional__size-input"
          type="text"
          ref="notionalInput"
          defaultValue={formattedSize}
          onClick={this.handleSelect}
          onChange={(e: any) => this.handleInputChange(e)}
          onBlur={(e: any) => this.processNotional(e.target.value)}
          onKeyPress={(e: any) => this.handleKeyPressNotionalInput(e)}/>
      </div>
    )
  }

  handleKeyPressNotionalInput(e: any) {
    const charCode = e.charCode

    if (e.key === ENTER) {
      this.processNotional(e.target.value)
    } else if (charCode === CHAR_CODE_DOT) {
      // only allow one dot
      const numDots = e.target.value.match(/\./g).length
      if (numDots > 0) {
        e.nativeEvent.stopImmediatePropagation()
        e.preventDefault()
      }
    } else if (!this.inputIsAllowed(charCode)) {
      e.nativeEvent.stopImmediatePropagation()
      e.preventDefault()
    }
  }

  processNotional(inputValue: string) {
    const inputValueTrimmed = inputValue.trim()
    let notional: any = utils.convertNotionalShorthandToNumericValue(inputValueTrimmed)
    if (notional >= MAX_NOTIONAL_VALUE) {
      notional = 0
    }
    if (!isNaN(notional)) {
      // send temp notional back to parent
      this.props.onNotionalInputChange(notional)

      // user may be trying to enter decimals. restore BACK into input
      if (inputValueTrimmed.indexOf(DOT) === inputValueTrimmed.length - 1) {
        notional = notional + DOT
      }
      // propagate change back to dom node's value
      this.refs.notionalInput.value = numeral(notional).format(NUMERAL_FORMAT)
    }
  }

  handleSelect(e: any) {
    const el = e.target
    el.setSelectionRange(0, el.value.length)
  }

  handleInputChange(e: any) {
    const rawValue = (this.refs.notionalInput.value || e.target.value).trim()
    // check for a shortcut input
    if (utils.hasShorthandInput(rawValue)) {
      this.processNotional(rawValue)
    }
  }

  inputIsAllowed(charCode: number) {
    // allow charcter codes before the Unit Separator to catch Shift, Backspace, etc
    if (charCode <= CHAR_CODE_UNIT_SEP) return true

    // allow shortcut values
    if (SHORTCUT_CHAR_CODES.indexOf(charCode) !== -1) return true

    // allow numeric values:
    if (charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9) return true
    return false
  }
}
