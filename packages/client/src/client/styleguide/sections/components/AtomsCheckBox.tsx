import { ComponentProps } from "react"
import styled from "styled-components"

import { CheckBoxInput } from "@/client/components/Form/CheckBoxInput/CheckBoxInput"

import { CommonStates } from "../atomStates"

interface Props {
  state: CommonStates
}

const AtomsCheckBoxInner = styled(CheckBoxInput)<Props>`
  justify-content: center;
  border: none;
  pointer-events: none;
`

export const AtomsCheckBox = ({
  state,
  ...props
}: Props & ComponentProps<typeof AtomsCheckBoxInner>) => {
  let className = ""
  switch (state) {
    case CommonStates.Focus:
      className = "sg-checkbox-focus"
      break
    case CommonStates.Hover:
      className = "sg-checkbox-hover"
      break
  }

  return <AtomsCheckBoxInner className={className} {...props} />
}
