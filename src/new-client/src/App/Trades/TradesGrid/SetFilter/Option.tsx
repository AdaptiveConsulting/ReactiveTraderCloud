interface OptionProps {
  value: any
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Option: React.FC<OptionProps> = ({
  value,
  label,
  checked,
  onChange,
}) => {
  return (
    <div key={value} className="filter-container__checkbox-container">
      <input
        key={value}
        name={value}
        type="checkbox"
        className="filter-container__checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label>{label ?? value}</label>
    </div>
  )
}
