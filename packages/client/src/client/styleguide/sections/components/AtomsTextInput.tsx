import { ComponentProps } from "react"
import styled from "styled-components"

import { TextInput } from "@/client/components/Form/TextInput"

import { TextInputStates } from "../atomStates"

interface Props {
  state: TextInputStates
}

export const AtomsTextInputInner = styled(TextInput)<Props>`
  pointer-events: none;
`
export const AtomsTextInput = ({
  state,
  ...props
}: Props & ComponentProps<typeof AtomsTextInputInner>) => {
  let className = ""

  switch (state) {
    case TextInputStates.Focus:
      className = "sg-text-input-focus"
      break
    case TextInputStates.Hover:
      className = "sg-text-input-hover"
      break
    case TextInputStates.Active:
      className = "sg-text-input-active"
      break
  }

  return <AtomsTextInputInner className={className} {...props} />
}
