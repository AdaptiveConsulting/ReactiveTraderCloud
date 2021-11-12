import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { from, merge } from "rxjs"
import {
  distinctUntilChanged,
  groupBy,
  map,
  mergeMap,
  scan,
} from "rxjs/operators"

type TearOutSectionEntry = [boolean, string]

export const [tearOutSectionEntry$, tearOutSection] = createSignal(
  (bool: boolean, section: string): TearOutSectionEntry => [bool, section],
)

export const [useTearOutSectionEntry] = bind<TearOutSectionEntry | null>(
  tearOutSectionEntry$,
  null,
)

export const [useTearOutTileState$] = bind(
  (id: string) =>
    tearOutSectionEntry$.pipe(
      map((val) => {
        // console.log(val[1], id,"haf erf")
        if (val[1] === id) {
          return val[0]
        }
      }),
    ),
  false,
)
