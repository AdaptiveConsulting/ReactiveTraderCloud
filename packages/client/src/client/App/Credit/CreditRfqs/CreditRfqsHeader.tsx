import styled from "styled-components"

import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"
import { removeRfqs, useExecutedRfqIds } from "@/services/credit"

import { ClearRfqsIcon } from "./ClearRfqsIcon"
import {
  RFQS_TABS,
  setSelectedRfqsTab,
  useSelectedRfqsTab,
} from "./selectedRfqsTab"

const ClearRfqsButton = styled.button<{ disabled: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.secondary.base};
  background-color: ${({ theme }) => theme.core.lightBackground};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

export const CreditRfqsHeader = () => {
  const rfqState = useSelectedRfqsTab()
  const executedRfqIds = useExecutedRfqIds()

  const actions: TabBarActionConfig = [
    {
      name: "clearRfqs",
      inner: (
        <ClearRfqsButton
          onClick={() => removeRfqs(executedRfqIds)}
          disabled={executedRfqIds.length === 0}
        >
          {ClearRfqsIcon}
        </ClearRfqsButton>
      ),
    },
  ]

  return (
    <TabBar
      items={RFQS_TABS}
      activeItem={rfqState}
      actions={actions}
      handleItemOnClick={(item) => setSelectedRfqsTab(item)}
    />
  )
}
