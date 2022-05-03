import { useEffect, useRef } from "react"
import { ChannelClient } from "openfin/_v2/main"

function useInterApplicationBus(): (symbol: string) => void {
  const channelClientRef = useRef<null | ChannelClient>(null)
  const connectRetriesRef = useRef(1)
  const disconnectedIntentionallyRef = useRef(false)

  useEffect(() => {
    if (!window.fin) {
      return
    }
    function handleDisconnection() {
      console.log("Disconnected from InterApplicationBus")
      // suppress sending messages until connection established
      channelClientRef.current = null

      // prevent infinite recursion on recurring disconnections
      connectRetriesRef.current += 1
      const CONNECTION_RETRY_LIMIT = 50
      if (connectRetriesRef.current > CONNECTION_RETRY_LIMIT) {
        console.log(
          `Exceeded connection retry limit of ${CONNECTION_RETRY_LIMIT}, ` +
            `will not reconnect to InterApplicationBus`,
        )
        return
      }
      if (disconnectedIntentionallyRef.current) {
        console.log(
          "Connection to InterApplicationBus has been terminated " +
            "intentionally, will not reconnect",
        )
        return
      }
      connectToInterApplicationBus()
    }
    async function connectToInterApplicationBus() {
      console.log(
        `About to connect to InterApplicationBus, attempt ${connectRetriesRef.current}`,
      )
      try {
        channelClientRef.current =
          await fin.InterApplicationBus.Channel.connect("reactive-ecosystem")
        console.log("Successfully connected to InterApplicationBus")
        channelClientRef.current.onDisconnection(handleDisconnection)
      } catch (e) {
        console.log("Unable to connect to InterApplicationBus", e)
      }
    }

    connectToInterApplicationBus()

    return () => {
      disconnectedIntentionallyRef.current = true // suppress reconnection
      channelClientRef.current?.disconnect()
    }
  }, [])

  return function dispatchSelectedSymbol(symbol: string) {
    if (!window.fin) {
      return
    }
    if (channelClientRef.current === null) {
      console.log(
        "Unable to dispatch symbol selection message; channel connection not established",
      )
      return
    }
    const payload = { symbol }
    console.log("About to dispatch symbol selection message", payload)
    channelClientRef.current
      .dispatch("symbol-selection", payload)
      .catch((e) =>
        console.error("Failed to dispatch symbol selection message", e),
      )
  }
}

export default useInterApplicationBus
