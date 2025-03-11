import { ComponentProps, PropsWithChildren } from "react"
import styled from "styled-components"

import { Button } from "@/client/components/Button"

import { CommonStates } from "../atomStates"

interface Props {
  state: CommonStates
}

export const AtomsButtonInner = styled(Button)`
  width: 80px;
  pointer-events: none;
`

export const AtomsButton = ({
  state,
  ...props
}: PropsWithChildren<Props & ComponentProps<typeof AtomsButtonInner>>) => {
  let className = ""

  switch (state) {
    case CommonStates.Hover:
      className = "sg-button-hover"
      break
    case CommonStates.Focus:
      className = "sg-button-focus"
      break
  }

  return <AtomsButtonInner className={className} {...props} />
}
