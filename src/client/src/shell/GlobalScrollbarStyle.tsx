import { injectGlobal } from 'emotion'
import { memoize } from 'lodash'
import { rgba } from 'polished'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { ThemeConsumer } from 'rt-theme'

export const css = memoize(
  color => `
    body ::-webkit-scrollbar-thumb {
      background-color: ${color};
    }
`,
  color => color,
)

export class GlobalScrollbarStyle extends Component {
  componentDidMount() {
    // tslint:disable-next-line:no-unused-expression
    injectGlobal`
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
        border: 12px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
      }
      
      body ::-webkit-scrollbar-corner {
        background-color: rgba(0,0,0,0);
      }

      body .ag-body ::-webkit-scrollbar {
        width: 28px;
        height: 28px;
      }

      body .ag-body ::-webkit-scrollbar-thumb {
        width: 8px;
        height: 80px;
      }
    `
  }
  render() {
    return (
      <ThemeConsumer>
        {theme => (
          <Helmet>
            <style>{css(rgba(theme.secondary[3], 0.2))}</style>
          </Helmet>
        )}
      </ThemeConsumer>
    )
  }
}
