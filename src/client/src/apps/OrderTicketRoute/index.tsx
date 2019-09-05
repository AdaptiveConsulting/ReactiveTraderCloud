import React, { useState } from 'react'

import { PlatformWrapper, PlatformAdapter } from 'rt-platforms'
import { platform, PlatformProvider } from 'rt-components'
import { ThemeProvider } from 'rt-theme'

import { OrderTicket } from './OrderTicket'

const getPlatform = (p: PlatformWrapper): PlatformAdapter => p.platform

export default function OrderTicketRoute() {
  const [instance, setInstance] = useState(0)
  const reset = () => setInstance(instance + 1)

  return (
    <ThemeProvider>
      <PlatformProvider value={getPlatform(platform)}>
        <OrderTicket key={`OrderTicket${instance}`} reset={reset} />
      </PlatformProvider>
    </ThemeProvider>
  )
}
