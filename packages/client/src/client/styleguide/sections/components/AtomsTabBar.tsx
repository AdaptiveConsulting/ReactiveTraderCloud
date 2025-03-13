import { useState } from "react"

import { Box } from "@/client/components/Box"
import { TabBar } from "@/client/components/TabBar"

export const AtomsTabBar = ({ items }: { items: string[] }) => {
  const [activeItem, setActiveItem] = useState(items[0])

  return (
    <Box marginTop="xl">
      <TabBar
        items={items}
        activeItem={activeItem}
        handleItemOnClick={(item) => setActiveItem(item)}
      />
    </Box>
  )
}
