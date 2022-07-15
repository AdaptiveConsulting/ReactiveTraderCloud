import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { filter, scan, tap } from "rxjs/operators"
import { handleTearOutSection } from "./handleTearOutSection"

type TearOutSectionEntry = [boolean, Section]

type tornOutSize = { width: number; height: number }

export type Section = "tiles" | "blotter" | "analytics" | "newRfq"

export type SectionConfig = { [section in Section]: tornOutSize }

export type TornOutSection = { [section in Section]: boolean }

export const [tearOutSectionEntry$, tearOutSection] = createSignal(
  (bool: boolean, section: Section): TearOutSectionEntry => [bool, section],
)

export function getTornOutSections<T extends Section>(sections: readonly T[]) {
  const initialSectionsState = sections.reduce((acc, section) => {
    acc[section] = false
    return acc
  }, {} as Record<T, boolean>)

  const [useTornOutSectionState] = bind(
    tearOutSectionEntry$.pipe(
      filter(([, section]) => sections.some((sec) => sec === section)),
      // Should this side effect be passed in by the component to make it more explicit?
      tap((sectionEntry) => {
        if (sectionEntry) {
          const [tornOut, section] = sectionEntry
          if (tornOut) {
            handleTearOutSection(section)
          }
        }
      }),
      scan((sectionsState, sectionEntry) => {
        if (sectionEntry) {
          const [tornOut, section] = sectionEntry
          return {
            ...sectionsState,
            [section]: tornOut,
          }
        }

        return sectionsState
      }, initialSectionsState),
    ),
    initialSectionsState,
  )

  return useTornOutSectionState
}

export const sectionConfig: SectionConfig = {
  blotter: {
    width: window.innerWidth - window.innerWidth * 0.15,
    height: window.innerHeight - window.innerHeight * 0.5,
  },
  tiles: {
    width: window.innerWidth - window.innerWidth * 0.15,
    height: window.innerHeight - window.innerHeight * 0.5,
  },
  analytics: {
    width: window.innerWidth - window.innerWidth * 0.7,
    height: window.innerHeight,
  },
  newRfq: {
    width: window.innerWidth - window.innerWidth * 0.7,
    height: window.innerHeight,
  },
}
