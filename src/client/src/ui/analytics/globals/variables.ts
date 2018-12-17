import { rgba } from 'polished'
import { colors } from 'test-theme'

export const transparentColor = rgba(colors.spectrum.offblack.base, 0)
export const strokeColor = transparentColor
export const gray = rgba(transparentColor, 0.5)

export const positiveColor = colors.accents.good.base
export const negativeColor = colors.accents.bad.base
export const barBgColor = 'currentColor'
export const pointerColor = 'currentColor'

export const transitionDuration = '200ms'
