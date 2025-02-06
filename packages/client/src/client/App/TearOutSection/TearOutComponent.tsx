import { useContext } from "react"
import styled from "styled-components"

import { tearOutSection } from "@/client/App/TearOutSection/state"
import { TearOutContext } from "@/client/App/TearOutSection/tearOutContext"
import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { closeWindow } from "@/client/utils/window/closeWindow"

import { Section } from "./state"

const HeaderTearOutAction = styled.div`
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Foreground/fg-quinary (400)"]};
  &:hover {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-quinary_hover"]};
  }
`

interface Props {
  section: Section
  width?: number
  height?: number
}

export const TearOutComponent = ({ section, width, height }: Props) => {
  const tearOutContext = useContext(TearOutContext)
  return (
    <HeaderTearOutAction
      onClick={() =>
        tearOutContext.isTornOut
          ? closeWindow()
          : tearOutSection(!tearOutContext.isTornOut, section, width, height)
      }
    >
      {tearOutContext.isTornOut ? PopInIcon : PopOutIcon}
    </HeaderTearOutAction>
  )
}
