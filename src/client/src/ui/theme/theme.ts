const colors = {
  error: '#d32121',
  success: '#7ed321',
  warning: '#f8ab02',
  primary: '#00a8cc'
}

const darkColors = {
  ...colors,
  background: 'black'
}

const footer = {
  colors: {
    background: '#00a8cc'
  }
}

const darkFooter = {
  colors: {
    background: '#00008B'
  }
}

const theme = {
  colors,
  footer
}

export const darkTheme = {
  ...theme,
  colors: darkColors,
  footer: darkFooter
}

export const lightTheme = theme

type Theme = typeof theme
export type Styled<P extends {}> = P & {
  theme?: Theme
}
