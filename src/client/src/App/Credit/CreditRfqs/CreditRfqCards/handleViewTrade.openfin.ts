import { TOPIC_HIGHLIGHT_CREDIT_BLOTTER } from "@/notifications.openfin"

export function handleViewTrade(tradeId: string) {
  fin.InterApplicationBus.publish(TOPIC_HIGHLIGHT_CREDIT_BLOTTER, { tradeId })
}
