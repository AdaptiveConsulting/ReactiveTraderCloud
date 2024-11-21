import { createKeyedSignal } from "@react-rxjs/utils"
import { createContext, PropsWithChildren } from "react"

export type FormControlValue = string

const formSignal = createKeyedSignal(
  (update) => update.name,
  (name: string, value: FormControlValue) => ({ name, value }),
)

export const FormContext = createContext<typeof formSignal | undefined>(
  undefined,
)

export const Form = ({ children }: PropsWithChildren) => (
  <FormContext.Provider value={formSignal}>{children}</FormContext.Provider>
)
