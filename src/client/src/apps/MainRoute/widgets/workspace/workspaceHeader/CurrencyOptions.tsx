import React, { useRef, useState } from 'react'
import { usePopUpMenu } from 'rt-util/hooks'
import { DropdownMenu, DropdownOption, DropdownWrapper } from './styled'

interface Props {
  options: string[]
  onSelectionChange: (selection: string) => void
}

const CurrencyOptions: React.FC<Props> = ({ options, onSelectionChange }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const [selected, setSelected] = useState(options[0])

  const toggle = () => setDisplayMenu(!displayMenu)

  const handleClick = (ccy: string) => {
    setSelected(ccy)
    onSelectionChange(ccy)
  }

  return (
    <DropdownWrapper onClick={toggle}>
      <div className="dd-placeholder">{selected}</div>
      <div>
        {displayMenu ? <i className="fa fa-chevron-up" /> : <i className="fa fa-chevron-down" />}
      </div>

      {displayMenu && (
        <DropdownMenu ref={ref}>
          {options.map(ccyOption => (
            <DropdownOption
              key={ccyOption}
              className="dd-option"
              onClick={() => handleClick(ccyOption)}
              selected={selected === ccyOption}
            >
              {ccyOption}
              {selected === ccyOption && <i className="fa fa-check" aria-hidden="true" />}
            </DropdownOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  )
}

export default CurrencyOptions
