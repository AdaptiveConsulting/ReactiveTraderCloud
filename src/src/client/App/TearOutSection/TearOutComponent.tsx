import { useContext } from "react"

import { tearOutSection } from "@/client/App/TearOutSection/state"
import { TearOutContext } from "@/client/App/TearOutSection/tearOutContext"
import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { closeWindow } from "@/client/utils/window/closeWindow"

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
