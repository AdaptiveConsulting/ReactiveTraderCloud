import styled from "styled-components"

import {
  CheckBox,
  CheckBoxInput,
  focus,
  hover,
} from "@/client/components/Form/CheckBoxInput.tsx/CheckBoxInput"

import { CommonStates } from "../atomStates"

interface Props {
  state: CommonStates
}

export const AtomsCheckBox = styled(CheckBoxInput)<Props>`
  ${CheckBox} {
    ${({ state }) => {
      switch (state) {
        case CommonStates.Focus:
          return focus
        case CommonStates.Hover:
          return hover
      }
    }}
  }
  justify-content: center;
  border: none;
  pointer-events: none;
`
