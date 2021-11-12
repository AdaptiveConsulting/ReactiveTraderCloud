import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { tearOutSection } from "./state"

export function handleTearOutSection(section: string) {
  openWindow(
    {
      url: constructUrl(`/${section}`),
      name: section,
      width: 380,
      height: 170,
    },
    () => tearOutSection(false, section),
  )
}

export const supportsTearOut = true
