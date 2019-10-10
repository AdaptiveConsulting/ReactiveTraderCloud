import React, { FC } from 'react'
import { ThemeProvider } from 'rt-theme'
import { Spotlight } from './Spotlight'

export const ThemedSpotlight: FC = () => (
  <ThemeProvider>
    <Spotlight />
  </ThemeProvider>
)
