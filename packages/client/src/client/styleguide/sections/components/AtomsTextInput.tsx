import styled from "styled-components"

import { TextInput } from "@/client/components/Form/TextInput"
import { stateStyles as textInputStateStyles } from "@/client/components/Form/TextInput.styled"

import { TextInputStates } from "../atomStates"

interface Props {
  state: TextInputStates
}

export const AtomsTextInput = styled(TextInput)<Props>`
  ${({ state }) => {
    switch (state) {
      case TextInputStates.Focus:
        return textInputStateStyles.focus
      case TextInputStates.Hover:
        return textInputStateStyles.hover
      case TextInputStates.Active:
        return textInputStateStyles.active
    }
  }}
  pointer-events: none;
`
