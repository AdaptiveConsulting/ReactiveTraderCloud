import { HeaderTearOutAction } from "@/components/headerActionStyles"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutSection } from "@/Web/TearOutSection/state"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { TearOutContext } from "@/components/tearOutContext"
import { useContext } from "react"

export const TearOutComponent: React.FC<{ section: string }> = ({
  section,
}) => {
  const tearOutContext = useContext(TearOutContext)
  return (
    <HeaderTearOutAction
      onClick={() =>
        tearOutContext.isTornOut
          ? window.close()
          : tearOutSection(!tearOutContext.isTornOut, section)
      }
    >
      {tearOutContext.isTornOut ? <PopInIcon /> : <PopOutIcon />}
    </HeaderTearOutAction>
  )
}
