import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map, filter } from "rxjs/operators"

type TearOutSectionEntry = [boolean, Section]

type tornOutSize = { width: number; height: number }

export type Section = "liverates" | "trades" | "analytics"

export type SectionConfig = { [section in Section]: tornOutSize }

export type TornOutSection = { [section in Section]: boolean }

export const [tearOutSectionEntry$, tearOutSection] = createSignal(
  (bool: boolean, section: Section): TearOutSectionEntry => [bool, section],
)

export const [useTearOutSectionEntry] = bind<TearOutSectionEntry | null>(
  tearOutSectionEntry$,
  null,
)

export const sectionConfig: SectionConfig = {
  liverates: {
    width: window.innerWidth - window.innerWidth * 0.15,
    height: window.innerHeight - window.innerHeight * 0.5,
  },
  trades: {
    width: window.innerWidth - window.innerWidth * 0.15,
    height: window.innerHeight - window.innerHeight * 0.75,
  },
  analytics: {
    width: window.innerWidth - window.innerWidth * 0.7,
    height: window.innerHeight,
  },
}
