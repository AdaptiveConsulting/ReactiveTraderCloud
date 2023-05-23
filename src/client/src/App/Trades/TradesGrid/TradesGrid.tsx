import { joinChannel } from "@finos/fdc3"
import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import { Observable } from "rxjs"
import styled from "styled-components"

import { Section } from "@/App/TearOutSection/state"
import { Loader } from "@/components/Loader"
import { isBlotterDataStale$, Trade } from "@/services/trades"
import { CompositeTrade } from "@/services/trades/types"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"

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

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)

interface TradesGridProps<Row extends Trade> {
  columnFields: FxColField[]
  columnDefinitions: ColDef
  trades$: Observable<CompositeTrade[]>
  caption: string
  highlightedRow: number | null | undefined
  isRowCrossed?: (row: Row) => boolean
  onRowClick?: (row: Row) => void
  section: Section
}

export const TradesGrid = <Row extends Trade>({
  columnFields,
  columnDefinitions,
  trades$,
  caption,
  highlightedRow,
  isRowCrossed,
  onRowClick,
  section,
}: TradesGridProps<Row>) => {
  useEffect(() => {
    if (window.fdc3) {
      // https://developer.openfin.co/docs/javascript/stable/tutorial-fdc3.joinChannel.html
      joinChannel("green") //async
    }
  }, [])

  return (
    <Subscribe fallback={<Loader ariaLabel="Loading trades blotter" />}>
      <ColFieldsContext.Provider value={columnFields}>
        <ColDefContext.Provider value={columnDefinitions}>
          <TradesStreamContext.Provider value={trades$}>
            <HighlightedRowContext.Provider value={highlightedRow}>
              <SuspenseOnStaleData />
              <TradesStyle role="region" aria-labelledby="trades-table-heading">
                <TradesHeader section={section} />
                <TradesGridInner
                  isRowCrossed={isRowCrossed}
                  onRowClick={onRowClick}
                  caption={caption}
                />
                <TradesFooter />
              </TradesStyle>
            </HighlightedRowContext.Provider>
          </TradesStreamContext.Provider>
        </ColDefContext.Provider>
      </ColFieldsContext.Provider>
    </Subscribe>
  )
}
