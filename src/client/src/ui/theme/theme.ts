const colors = {
  error: '#d32121',
  success: '#7ed321',
  warning: '#f8ab02',
  primary: '#00a8cc'
}

const theme = {
  colors
}

export const darkTheme = {
  ...theme
}
export const lightTheme = theme

export type Theme = typeof theme
