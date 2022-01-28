import { HeaderTearOutAction } from "./TearOutComponent.styles"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutSection } from "@/App/TearOutSection/state"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { TearOutContext } from "@/App/TearOutSection/tearOutContext"
import { useContext } from "react"
import { closeWindow } from "@/utils/window/closeWindow"
import { Section } from "./state"

export const TearOutComponent: React.FC<{ section: Section }> = ({
  section,
}) => {
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
