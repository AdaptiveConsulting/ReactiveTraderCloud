import styled from "styled-components"

import { Button } from "@/client/components/Button"
import buttonStateStyles from "@/client/components/Button.styled"

import { CommonStates } from "../atomStates"

interface Props {
  state: CommonStates
}
export const AtomsButton = styled(Button)<Props>`
  ${({ state, variant }) => {
    const styleVariant:
      | Exclude<typeof variant, "white-outline">
      | "whiteOutline" = variant === "white-outline" ? "whiteOutline" : variant

    switch (state) {
      case CommonStates.Hover:
        return buttonStateStyles[styleVariant].hover
      case CommonStates.Focus:
        return buttonStateStyles[styleVariant].focus
    }
  }}
  width: 80px;
  pointer-events: none;
`
