import { memoize } from 'lodash'
import { rgba } from 'polished'
import React from 'react'
import Helmet from 'react-helmet'
import { ThemeConsumer } from 'rt-theme'

export const css = memoize(
  color => `
  body, #root {
    overflow: hidden;
  }

  body ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  body ::-webkit-scrollbar-thumb {
    border-radius: 22px;
    background-color: rgba(212, 221, 232, .4);
    

    height: 16px;
    border: 4.5px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    background-color: ${color};
  }
  
  body ::-webkit-scrollbar-corner {
    background-color: rgba(0,0,0,0);
  }

  body .ag-body ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  body .ag-body ::-webkit-scrollbar-thumb {
    border-width: 2px;
  }
`,
  color => color,
)

export const GlobalScrollbarStyle = () => (
  <ThemeConsumer>
    {theme => (
      <Helmet>
        <style>{css(rgba(theme.secondary[3], 0.2))}</style>
      </Helmet>
    )}
  </ThemeConsumer>
)

export default GlobalScrollbarStyle
