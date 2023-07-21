import { DisconnectionOverlay } from "@/client/components/DisconnectionOverlay"
import { WithChildren } from "@/client/utils/utilityTypes"

import { TearOutContext } from "./tearOutContext"

export const TornOut = ({ children }: WithChildren) => (
  <TearOutContext.Provider value={{ isTornOut: true }}>
    {children}
    <DisconnectionOverlay />
  </TearOutContext.Provider>
)
