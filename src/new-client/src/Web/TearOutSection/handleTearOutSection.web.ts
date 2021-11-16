import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { tearOutSection } from "./state"

type Section = "liverates" | "trades" | "analytics"

const sectionConfig = {
  liverates: {
    width: 1600,
    height: 800,
  },
  trades: {
    width: 1600,
    height: 500,
  },
  analytics: {
    width: 500,
    height: 1500,
  },
}

export function handleTearOutSection(section: Section) {
  const { width, height } = sectionConfig[section]
  openWindow(
    {
      url: constructUrl(`/${section}`),
      name: section,
      width: width,
      height: height,
    },
    () => tearOutSection(false, section),
  )
}
