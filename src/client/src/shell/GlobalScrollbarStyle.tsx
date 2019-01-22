import { memoize } from 'lodash'
import { rgba } from 'polished'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { withTheme, createGlobalStyle } from 'styled-components'
import { Theme } from 'rt-theme'

export const css = memoize(
  color => `
    body ::-webkit-scrollbar-thumb {
      background-color: ${color};
    }
`,
  color => color,
)

const ScrollbarGlobal = createGlobalStyle`
body, #root {
  overflow: hidden;
}

body ::-webkit-scrollbar {
  width: 14px;
  height: 14px;
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
`

export class GlobalScrollbarStyle extends Component<{ theme: Theme }> {
  render() {
    return (
      <React.Fragment>
        <ScrollbarGlobal />
        <Helmet>
          <style>{css(rgba(this.props.theme.secondary[3], 0.2))}</style>
        </Helmet>
      </React.Fragment>
    )
  }
}

export default withTheme(GlobalScrollbarStyle)
