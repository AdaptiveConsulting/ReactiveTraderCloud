import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { tearOutSection } from "./state"

export function handleTearOutSection(section: string) {
  let width = 380
  let height = 380
  if (section == "liverates") {
    width = 1600
    height = 800
  } else if (section == "trades") {
    width = 1600
    height = 500
  } else if (section === "analytics") {
    width = 500
    height = 1500
  }
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

export const supportsTearOut = true
