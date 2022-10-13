import { ROUTES_CONFIG } from "@/constants"
import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { tearOutSection, Section, sectionConfig } from "./state"

export function handleTearOutSection(section: Section) {
  const { width, height } = sectionConfig[section]
  openWindow(
    {
      url: constructUrl(ROUTES_CONFIG[section]),
      name: section,
      width: width,
      height: height,
    },
    () => tearOutSection(false, section),
  )
}
