import { Section } from "@/client/App/TearOutSection/state"
import { supportsTearOut } from "@/client/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/client/App/TearOutSection/TearOutComponent"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"

import { AppliedFilters } from "./AppliedFilters"
import { ExcelButton } from "./ExcelButton"
import { QuickFilter } from "./QuickFilter"

export const TradesHeader = ({
  section,
  title = "Trades",
  showTools,
}: {
  section?: Section
  title?: string
  showTools: boolean
}) => {
  const items: string[] = [title]

  const actions: TabBarActionConfig = [
    {
      name: "excel",
      inner: <ExcelButton />,
    },
    {
      name: "filter",
      inner: (
        <>
          <AppliedFilters />
          <QuickFilter />
        </>
      ),
      size: "lg",
    },
  ]

  if (supportsTearOut && section) {
    actions.push({
      name: "tearOut",
      inner: <TearOutComponent section={section} />,
    })
  }

  return (
    <TabBar
      items={items}
      activeItem={title}
      actions={showTools ? actions : undefined}
    />
  )
}
