import { rgba } from "polished"
import { withTheme, createGlobalStyle } from "styled-components"
import { Theme } from "./themes"

const getColor = (props: { theme: Theme }) =>
  rgba(props.theme.secondary[3], 0.2)

export const GlobalScrollbarStyle = withTheme(createGlobalStyle`
body, #root {
  // overflow: hidden; // TODO
}

body ::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

body ::-webkit-scrollbar-thumb {
  background-color: ${getColor};
}

body {
  scrollbar-color: ${getColor} transparent;
  background-color: ${({ theme }) => theme.core.darkBackground};
}

body ::-webkit-scrollbar-thumb {
  border-radius: 22px;
  background-color: rgba(212, 221, 232, .4);
  

  height: 16px;
  border: 4.5px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
}

body ::-webkit-scrollbar-corner {
  background-color: rgba(0,0,0,0);
}

body .ag-body ::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
`)
