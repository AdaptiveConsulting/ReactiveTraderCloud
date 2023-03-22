import { useContext } from "react"

import { tearOutSection } from "@/App/TearOutSection/state"
import { TearOutContext } from "@/App/TearOutSection/tearOutContext"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { closeWindow } from "@/utils/window/closeWindow"

import { Section } from "./state"
import { HeaderTearOutAction } from "./TearOutComponent.styles"

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
