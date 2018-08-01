interface InputCoreColors {
  brandPrimary?: string
  brandSecondary?: string
  accentPrimary?: string
  accentGood?: string
  accentWarning?: string
  accentBad?: string
}

export type CoreColors = Required<InputCoreColors>

const getCoreColors = (coreColors?: InputCoreColors) => {
  const BRAND_PRIMARY = '#28588D'
  const BRAND_SECONDARY = '#444C5F'

  const ACCENT_PRIMARY = '#5F94F5'
  const ACCENT_GOOD = '#28C988'
  const ACCENT_WARNING = '#F9BA4C'
  const ACCENT_BAD = '#F94C4C'

  return {
    brandPrimary: (coreColors && coreColors.brandPrimary) || BRAND_PRIMARY,
    brandSecondary: (coreColors && coreColors.brandSecondary) || BRAND_SECONDARY,
    accentPrimary: (coreColors && coreColors.accentPrimary) || ACCENT_PRIMARY,
    accentGood: (coreColors && coreColors.accentGood) || ACCENT_GOOD,
    accentWarning: (coreColors && coreColors.accentWarning) || ACCENT_WARNING,
    accentBad: (coreColors && coreColors.accentBad) || ACCENT_BAD
  }
}

export default getCoreColors
