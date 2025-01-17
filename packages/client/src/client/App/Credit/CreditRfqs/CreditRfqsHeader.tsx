import styled from "styled-components"

import { BinIcon } from "@/client/components/icons/BinIcon"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"
import { removeRfqs, useExecutedRfqIds } from "@/services/credit"

import {
  RFQS_TABS,
  setSelectedRfqsTab,
  useSelectedRfqsTab,
} from "./selectedRfqsTab"

const BinButton = styled(BinIcon)`
  fill: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
`

export const CreditRfqsHeader = () => {
  const rfqState = useSelectedRfqsTab()
  const executedRfqIds = useExecutedRfqIds()

  const actions: TabBarActionConfig = [
    {
      name: "clearRfqs",
      inner: <BinButton />,
      onClick: () => removeRfqs(executedRfqIds),
      disabled: executedRfqIds.length === 0,
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
