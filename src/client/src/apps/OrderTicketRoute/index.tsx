import React, { useEffect, useState } from 'react'

import { ThemeProvider } from 'rt-theme'

import { OrderTicket } from './OrderTicket'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'

export default function OrderTicketRoute() {
  const [platform, setPlatform] = useState()
  const [instance, setInstance] = useState(0)
  const reset = () => setInstance(instance + 1)

  useEffect(() => {
    const getPlatform = async () => {
      const result = await getPlatformAsync()
      setPlatform(result)
    }

    getPlatform()
  }, [])

  return (
    platform && (
      <ThemeProvider>
        <PlatformProvider value={platform}>
          <OrderTicket key={`OrderTicket${instance}`} reset={reset} />
        </PlatformProvider>
      </ThemeProvider>
    )
  )
}
