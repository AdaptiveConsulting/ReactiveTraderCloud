import { joinChannel } from "@finos/fdc3"
import { useEffect } from "react"
import { Observable } from "rxjs"

import { Section } from "@/client/App/TearOutSection/state"
import { Loader } from "@/client/components/Loader"
import { Region } from "@/client/components/Region/Region"
import { createSuspenseOnStale } from "@/client/utils/createSuspenseOnStale"
import { isBlotterDataStale$, Trade } from "@/services/trades"
import { TradeType } from "@/services/trades/types"

import {
  ColDefContext,
  ColFieldsContext,
  HighlightedRowContext,
  TradesStreamContext,
} from "../Context"
import { TradesFooter } from "../TradesFooter"
import { TradesHeader } from "../TradesHeader"
import { ColDef } from "../TradesState"
import { FxColField } from "../TradesState/colConfig"
import { TradesGridInner } from "./TradesGridInner"

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)

interface GridRegionProps<Row extends Trade> {
  columnFields: FxColField[]
  columnDefinitions: ColDef
  trades$: Observable<TradeType[]>
  caption: string
  highlightedRow: number | null | undefined
  isRejected?: (row: Row) => boolean
  onRowClick?: (row: Row) => void
  section?: Section
  showHeaderTools: boolean
  title?: string
}

export const GridRegion = <Row extends Trade>({
  columnFields,
  columnDefinitions,
  trades$,
  caption,
  highlightedRow,
  isRejected,
  onRowClick,
  section,
  showHeaderTools,
  title,
}: GridRegionProps<Row>) => {
  useEffect(() => {
    if (window.fdc3) {
      // https://developer.openfin.co/docs/javascript/stable/tutorial-fdc3.joinChannel.html
      joinChannel("green") //async
    }
  }, [])

  return (
    <ColFieldsContext.Provider value={columnFields}>
      <ColDefContext.Provider value={columnDefinitions}>
        <TradesStreamContext.Provider value={trades$}>
          <HighlightedRowContext.Provider value={highlightedRow}>
            <Region
              aria-labelledby="trades-table-heading"
              fallback={<Loader ariaLabel="Loading trades blotter" />}
              Header={
                <TradesHeader
                  section={section}
                  showTools={showHeaderTools}
                  title={title}
                />
              }
              Body={
                <>
                  <TradesGridInner
                    isRejected={isRejected}
                    onRowClick={onRowClick}
                    caption={caption}
                  />
                  <TradesFooter />
                </>
              }
            >
              <SuspenseOnStaleData />
            </Region>
          </HighlightedRowContext.Provider>
        </TradesStreamContext.Provider>
      </ColDefContext.Provider>
    </ColFieldsContext.Provider>
  )
}
