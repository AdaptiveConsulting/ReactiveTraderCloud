import { BinIcon } from "@/client/components/icons"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"
import { removeRfqs, useExecutedRfqIds } from "@/services/credit"

import {
  RFQS_TABS,
  setSelectedRfqsTab,
  useSelectedRfqsTab,
} from "./selectedRfqsTab"

export const CreditRfqsHeader = () => {
  const rfqState = useSelectedRfqsTab()
  const executedRfqIds = useExecutedRfqIds()

  const actions: TabBarActionConfig = [
    {
      name: "clearRfqs",
      inner: <BinIcon />,
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
