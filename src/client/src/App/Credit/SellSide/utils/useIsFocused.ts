import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"

const [focused$, setFocused] = createSignal<boolean>()

const [useIsFocused] = bind(focused$, false)

export { setFocused, useIsFocused }
