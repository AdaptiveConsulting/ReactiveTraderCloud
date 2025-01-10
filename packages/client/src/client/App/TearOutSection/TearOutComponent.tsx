import { useContext } from "react"
import styled from "styled-components"

import { tearOutSection } from "@/client/App/TearOutSection/state"
import { TearOutContext } from "@/client/App/TearOutSection/tearOutContext"
import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { closeWindow } from "@/client/utils/window/closeWindow"

import { Section } from "./state"

const HeaderTearOutAction = styled.button`
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-quinary (400)"]};
  }
  &:hover {
    svg {
      fill: ${({ theme }) =>
        theme.newTheme.color["Colors/Foreground/fg-quinary_hover"]};
    }
    .tear-out-hover-state {
      fill: #5f94f5;
    }
  }
`

export const TearOutComponent = ({ section }: { section: Section }) => {
  const tearOutContext = useContext(TearOutContext)
  return (
    <HeaderTearOutAction
      onClick={() =>
        tearOutContext.isTornOut
          ? closeWindow()
          : tearOutSection(!tearOutContext.isTornOut, section)
      }
    >
      {tearOutContext.isTornOut ? <PopInIcon /> : <PopOutIcon />}
    </HeaderTearOutAction>
  )
}
