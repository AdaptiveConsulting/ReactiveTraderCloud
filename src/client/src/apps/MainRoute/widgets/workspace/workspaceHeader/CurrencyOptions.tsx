import React from 'react'
import { DropdownWrapper } from './styled'

interface Props {
  options: string[]
  onSelectionChange: (selection: string) => void
}

const CurrencyOptions: React.FC<Props> = ({ options, onSelectionChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onSelectionChange(e.target.value)

  return (
    <DropdownWrapper>
      <select onChange={handleChange} data-qa={`currency-dropdown`}>
        {options.map(currencyOption => (
          <option
            key={currencyOption}
            data-qa={`currency-dropdown-${currencyOption.toLowerCase()}`}
          >
            {currencyOption}
          </option>
        ))}
      </select>
      <i className="fa fa-chevron-down"></i>
    </DropdownWrapper>
  )
}

export default CurrencyOptions
