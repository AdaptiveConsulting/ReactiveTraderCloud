import { Subscribe } from "@react-rxjs/core"
import { Meta } from "@storybook/react"
import { Observable, of } from "rxjs"
import styled from "styled-components"

import { CreditTrade, FxTrade } from "@/client/services/trades"
import { mockCreditTrades } from "@/client/services/trades/__mocks__/creditTrades"
import { mockTrades } from "@/client/services/trades/__mocks__/trades.mock"

import {
  ColDefContext,
  ColFieldsContext,
  TradesStreamContext,
} from "../Context"
import {
  ColDef,
  creditColDef,
  creditColFields,
  fxColDef,
  fxColFields,
} from "../TradesState"
import { TradesGridInner } from "./TradesGridInner"

export default {
  title: "Trades/TradesGrid",
  component: TradesGridInner,
} as Meta<typeof TradesGridInner>

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

interface TradesGridWrapperProps {
  colDef: ColDef
  fields: (string | number)[]
  trades$: Observable<CreditTrade[] | FxTrade[]>
}

const TradesGridWrapper = ({
  colDef,
  fields,
  trades$,
}: TradesGridWrapperProps) => (
  <TradesStyle>
    <Subscribe>
      <ColFieldsContext.Provider value={fields}>
        <ColDefContext.Provider value={colDef}>
          <TradesStreamContext.Provider value={trades$}>
            <TradesGridInner caption="Example Trades Grid" />
          </TradesStreamContext.Provider>
        </ColDefContext.Provider>
      </ColFieldsContext.Provider>
    </Subscribe>
  </TradesStyle>
)

export const WithCreditTrades = {
  render: (args: TradesGridWrapperProps) => (
    <TradesGridWrapper {...args}></TradesGridWrapper>
  ),

  args: {
    colDef: creditColDef,
    fields: creditColFields,
    trades$: of(mockCreditTrades),
  },
}

export const WithFxTrades = {
  render: (args: TradesGridWrapperProps) => (
    <TradesGridWrapper {...args}></TradesGridWrapper>
  ),

  args: {
    colDef: fxColDef,
    fields: fxColFields,
    trades$: of(mockTrades),
  },
}

export const NoCreditTrades = {
  render: (args: TradesGridWrapperProps) => (
    <TradesGridWrapper {...args}></TradesGridWrapper>
  ),

  args: {
    colDef: creditColDef,
    fields: creditColFields,
    trades$: of([]),
  },
}

export const NoFxTrades = {
  render: (args: TradesGridWrapperProps) => (
    <TradesGridWrapper {...args}></TradesGridWrapper>
  ),

  args: {
    colDef: fxColDef,
    fields: fxColFields,
    trades$: of([]),
  },
}
