import { ROUTES_CONFIG } from "@/client/constants"
import { constructUrl } from "@/client/utils/constructUrl"
import { openWindow } from "@/client/utils/window/openWindow"

import { Section, sectionConfig, tearOutSection } from "./state"

export function handleTearOutSection(
  section: Section,
  width?: number,
  height?: number,
) {
  const config = sectionConfig[section]
  openWindow(
    {
      url: constructUrl(ROUTES_CONFIG[section]),
      name: section,
      width: width || config.width,
      height: height || config.height,
    },
    () => tearOutSection(false, section),
  )
}
