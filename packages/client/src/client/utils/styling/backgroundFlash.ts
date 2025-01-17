import { DefaultTheme, keyframes, ThemeProps } from "styled-components"

export const backgroundFlash = (props: ThemeProps<DefaultTheme>) => keyframes`
0% {
  background-color: ${props.theme.newTheme.color["Colors/Background/bg-primary"]};
}
50% {
  background-color: ${props.theme.newTheme.color["Colors/Background/bg-brand-primary"]};
}
100% {
  background-color: ${props.theme.newTheme.color["Colors/Background/bg-primary"]};
}
`
