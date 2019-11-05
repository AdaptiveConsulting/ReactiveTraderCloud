import React, {
  forwardRef,
  ChangeEventHandler,
  useState,
  useEffect,
  FocusEventHandler,
} from 'react'
import numeral from 'numeral'
import { ValidationMessage } from './types'

type FormattedNumericInputProps = JSX.IntrinsicElements['input'] & {
  numericValue: number
  onNumericValueChange?: (numericValue: number) => void
  validationMessage?: ValidationMessage
}

export const FormattedNumericInput = forwardRef<HTMLInputElement, FormattedNumericInputProps>(
  ({ numericValue, onNumericValueChange, onChange, onBlur, validationMessage, ...props }, ref) => {
    const [value, setValue] = useState(stringifyNumericValue(numericValue))

    useEffect(() => {
      setValue(stringifyNumericValue(numericValue))
    }, [numericValue])

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
      onChange && onChange(e)

      const enteredValue = e.target.value

      // update local state when entered < 100b with up-to-three decimal places
      if (enteredValue.match(/^([0-9],?){0,11}(\.[0-9]{0,3})?$/)) {
        setValue(enteredValue)
      }

      // update onchange when
      // - entered < 100b with no decimal places
      // - or < 100b with two decimal places
      // - or < 1m with up-to-three decimal places and k/m suffix
      if (
        onNumericValueChange &&
        enteredValue !== '' &&
        (enteredValue.match(/^([0-9],?){0,11}(\.[0-9]{2})?$/) ||
          enteredValue.match(/^([0-9],?){0,6}(\.[0-9]{0,3})?[km]$/))
      ) {
        onNumericValueChange(numeral(enteredValue).value())
      }
    }

    const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
      onBlur && onBlur(e)

      const enteredValue = e.target.value

      // update onblur when entered < 100b with up-to-two decimal places
      if (
        onNumericValueChange &&
        enteredValue !== '' &&
        enteredValue.match(/^([0-9],?){0,11}(\.[0-9]{0,2})?$/)
      ) {
        const newNumericValue = numeral(enteredValue).value()
        if (newNumericValue !== numericValue) {
          onNumericValueChange(newNumericValue)
          return
        }
      }

      // otherwise, reset value from props
      setValue(stringifyNumericValue(numericValue))
    }

    return <input ref={ref} {...props} value={value} onChange={handleChange} onBlur={handleBlur} />
  },
)

function stringifyNumericValue(numericValue: number) {
  const format = numericValue % 1 === 0 ? '0,0' : '0,0.00'
  return numeral(numericValue).format(format)
}

FormattedNumericInput.displayName = 'FormattedNumericInput'
