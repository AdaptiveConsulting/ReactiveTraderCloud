import React, { useEffect, useState } from 'react'

import { ThemeProvider } from 'rt-theme'

import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { Spotlight } from './Spotlight'

export default function SpotlightRoute() {
  const [platform, setPlatform] = useState(null)

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
          <Spotlight />
        </PlatformProvider>
      </ThemeProvider>
    )
  )
}
