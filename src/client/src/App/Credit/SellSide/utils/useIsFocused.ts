import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"

const [_focused$, setFocused] = createSignal<boolean>()

const [useIsFocused, focused$] = bind(_focused$, false)

export { focused$, setFocused, useIsFocused }
