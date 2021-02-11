import { watch$ } from "services/client"
import { delay, map, mergeAll, scan, switchMap, take } from "rxjs/operators"
import { split } from "@react-rxjs/utils"
import { merge, of } from "rxjs"
import { bind, shareLatest } from "@react-rxjs/core"
import { RawServiceStatus, ServiceInstanceStatus } from "./types"

const STATUS_TIMEOUT = 2000

export const [useStatus, status$] = bind(
  watch$<RawServiceStatus>("status").pipe(
    split(
      (raw) => raw.Instance,
      (instance$) =>
        merge(
          instance$.pipe(
            map((value) => ({ ...value, isAdded: true })),
            take(1),
          ),
          instance$.pipe(
            switchMap((info) =>
              of({ ...info, isAdded: false }).pipe(delay(STATUS_TIMEOUT)),
            ),
          ),
        ).pipe(take(2)),
    ),
    mergeAll(),
    scan((acc, item) => {
      const timestamp = Date.now()
      const result = { ...acc }
      if (item.isAdded) {
        result[item.Type] = {
          serviceType: item.Type,
          serviceId: item.Instance,
          timestamp,
          serviceLoad: (result[item.Type]?.serviceLoad ?? 0) + 1,
        }
      } else {
        result[item.Type] = {
          ...result[item.Type],
          serviceLoad: result[item.Type].serviceLoad - 1,
        }
      }
      return result
    }, {} as Record<string, ServiceInstanceStatus>),
    shareLatest(),
  ),
)
