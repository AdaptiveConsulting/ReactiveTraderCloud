import { useEffect } from "react"

import { Region } from "@/client/components/layout/Region"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"
import {
  registerCreditRfqCreatedNotifications,
  unregisterCreditRfqCreatedNotifications,
} from "@/client/notifications"
import { WithChildren } from "@/client/utils/utilityTypes"
import { registerSimulatedDealerResponses } from "@/services/credit/creditRfqResponses"

import { supportsTearOut } from "../../TearOutSection/supportsTearOut"
import { TearOutComponent } from "../../TearOutSection/TearOutComponent"
import { NewRfqForm } from "./NewRfqForm"

const NewRfqCore = ({ children }: WithChildren) => {
  useEffect(() => {
    const subscription = registerSimulatedDealerResponses()
    registerCreditRfqCreatedNotifications()
    return () => {
      subscription.unsubscribe()
      unregisterCreditRfqCreatedNotifications()
    }
  }, [])

  const items = ["New RFQ"]

  const actions: TabBarActionConfig = []

  if (supportsTearOut) {
    actions.push({
      name: "tearOut",
      inner: <TearOutComponent section="newRfq" />,
    })
  }

  return (
    <Region
      Header={<TabBar actions={actions} items={items} activeItem="New RFQ" />}
      Body={<NewRfqForm />}
      fallback={children}
    />
  )
}

export default NewRfqCore
