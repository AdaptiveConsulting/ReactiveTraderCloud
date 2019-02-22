import _ from 'lodash'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { styled, ThemeName, ThemeProvider, ThemeConsumer } from 'rt-theme'

import FloatingTools from './components/FloatingsTools'
import { Block, SectionBlock } from './styled'

import Atoms from './sections/Atoms'
import ColorSpectrum from './sections/ColorSpectrum'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Introduction from './sections/Introduction'

const sections = _.mapKeys(
  {
    Introduction,
    ColorSpectrum,
    CoreBranding,
    FontFamilies,
    Atoms,
    Ending: () => <SectionBlock mh={5} intent="inverted" />,
  },
  (value, key) => _.kebabCase(key),
)

const StyleguideRoute: React.FC = () => (
  <ThemeProvider storage={sessionStorage}>
    <Root>
      <ThemeConsumer>
        {({ name, setTheme }) => {
          return (
            <FloatingTools
              themeName={name}
              switchTheme={() =>
                setTheme({
                  name: name === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark,
                })
              }
            />
          )
        }}
      </ThemeConsumer>
      <BrowserRouter>
        <Switch>
          {_.map(sections, (Section, path) => (
            <Route key={path} path={`/styleguide/${path}`}>
              <Section />
            </Route>
          ))}

          <Route>
            <React.Fragment>
              {_.map(sections, (Section, path) => (
                <Section key={path} />
              ))}
            </React.Fragment>
          </Route>
        </Switch>
      </BrowserRouter>
    </Root>
  </ThemeProvider>
)

export const Root = styled(Block)`
  min-height: 100%;
  max-width: 100vw;
  overflow: hidden;
`

export default StyleguideRoute
export { StyleguideRoute }
