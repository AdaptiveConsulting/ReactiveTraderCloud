import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"

export const defaultWidth = 15

type horitzontalValue = number

export const [horitzontalResizeEntry$, horitzontalResize] = createSignal(
  (width: number): horitzontalValue => width,
)

export const [useHoritzontalResizeValues] = bind<horitzontalValue>(
  horitzontalResizeEntry$,
  defaultWidth,
)
