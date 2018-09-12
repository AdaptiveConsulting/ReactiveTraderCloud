import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { styled, ThemeState } from 'rt-theme'

import FloatingTools from './components/FloatingsTools'
import { SectionRoot } from './styled'
import Block from './styled/Block'

import Atoms from './sections/Atoms'
import ColorSpectrum from './sections/ColorSpectrum'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Header from './sections/Header'
// import Footer from './sections/footer.mdx';
// import Theme from './sections/theme.md';

const sections = { Header, ColorSpectrum, CoreBranding, FontFamilies, Atoms }
export class StyleguideRoute extends React.Component {
  render() {
    return (
      <ThemeState.Provider name="light">
        <Root>
          <ThemeState.Consumer>
            {({ name, setTheme }) => {
              return (
                <FloatingTools
                  themeName={name}
                  switchTheme={() =>
                    setTheme({
                      name: name === 'dark' ? 'light' : 'dark'
                    })
                  }
                />
              )
            }}
          </ThemeState.Consumer>
          <BrowserRouter>
            <Switch>
              {Object.keys(sections).map(path => (
                <Route key={path} path={`/styleguide/${path}`}>
                  <SectionRoot>{React.createElement(sections[path])}</SectionRoot>
                </Route>
              ))}
              <Route>
                <React.Fragment>
                  {Object.keys(sections).map(path => (
                    <SectionRoot>{React.createElement(sections[path])}</SectionRoot>
                  ))}
                </React.Fragment>
              </Route>
            </Switch>
          </BrowserRouter>
        </Root>
      </ThemeState.Provider>
    )
  }
}

export const Root = styled(Block)`
  min-height: 100%;
`
