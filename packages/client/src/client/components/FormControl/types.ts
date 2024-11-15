interface RadioItem {
  name: string
  checked: boolean
}

export type FormControlVariant = "radio" | "text"

export type RadioInputListItems = RadioItem[]

export interface FormControlPropsBase {
  label: string
}

interface FormControlPropsRadio extends FormControlPropsBase {
  variant: "radio"
  items: RadioInputListItems
  onChange: (item: string) => void
}

interface FormControlPropsText extends FormControlPropsBase {
  variant: "text"
}

export type FormControlProps = FormControlPropsRadio | FormControlPropsText
