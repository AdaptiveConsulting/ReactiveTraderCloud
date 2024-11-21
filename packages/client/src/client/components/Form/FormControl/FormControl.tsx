import { createContext, PropsWithChildren } from "react"
import { GroupedObservable } from "rxjs"

import { FormControlValue } from "../Form"

export const FormControlContext = createContext<
  | [
      (value: FormControlValue) => void,
      GroupedObservable<
        string,
        {
          name: string
          value: FormControlValue
        }
      >,
    ]
  | undefined
>(undefined)

export const FormControl = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>
}
