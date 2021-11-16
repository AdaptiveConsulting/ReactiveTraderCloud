import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map, filter } from "rxjs/operators"

type TearOutSectionEntry = [boolean, Section]

export type Section = "liverates" | "trades" | "analytics"

export const [tearOutSectionEntry$, tearOutSection] = createSignal(
  (bool: boolean, section: Section): TearOutSectionEntry => [bool, section],
)

export const [useTearOutSectionEntry] = bind<TearOutSectionEntry | null>(
  tearOutSectionEntry$,
  null,
)

export const sectionConfig = {
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
