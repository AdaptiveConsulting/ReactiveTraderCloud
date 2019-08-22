import React, { useState } from 'react'

import { platform, PlatformProvider } from 'rt-components'
import { ThemeProvider } from 'rt-theme'

import { OrderTicket } from './OrderTicket'

export default function OrderTicketRoute() {
  const [instance, setInstance] = useState(0)
  const reset = () => setInstance(instance + 1)

  return (
    <ThemeProvider>
      <PlatformProvider value={platform}>
        <OrderTicket key={`OrderTicket${instance}`} reset={reset} />
      </PlatformProvider>
    </ThemeProvider>
  )
}
