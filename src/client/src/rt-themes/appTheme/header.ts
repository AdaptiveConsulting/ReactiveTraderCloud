import Color from 'tinycolor2'

import { BaseTheme } from 'rt-themes/baseTheme'
import darkLogo from 'ui/styles/images/adaptive-logo-dark.svg'
import lightLogo from 'ui/styles/images/adaptive-logo-light.svg'

const header = (baseTheme: BaseTheme) => ({
  backgroundColor: baseTheme.background.primary,
  textColor: baseTheme.text.primary,
  logo: Color(baseTheme.background.primary).isLight() ? darkLogo : lightLogo
})

export default header
