import React from 'react'
import DropdowGrid from '../components/DropdowGrid'
import DropdowMenuGrid from '../components/DropdownMenuGrid'
import ButtonGrid from '../components/ButtonGrid'
import { H2, H3, H5, NumberedLayout } from '../elements'
import { ThemeName, useTheme } from 'rt-theme'
import { Paragraph, SectionBlock } from '../styled'

export const layout = React.Fragment
export const props = {}

export default () => {
  const { themeName } = useTheme()
  const isDark = themeName === ThemeName.Dark

  return (
    <React.Fragment>
      <SectionBlock mh={3}>
        <NumberedLayout number="2">
          <H5>Design Systems</H5>
          <H3>Adaptive UI Library</H3>
          <Paragraph>Basic controls of any UI</Paragraph>
        </NumberedLayout>
      </SectionBlock>

      <SectionBlock colorScheme="secondary" py={2} bleeds>
        <H2>{isDark ? 'Dark ' : 'Light '} Atoms</H2>
        <H3>Basic Elements</H3>
        <H3>Buttons</H3>
        <ButtonGrid />
      </SectionBlock>

      <SectionBlock colorScheme="secondary" py={2} bleeds>
        <H3>Dropdown</H3>
        <DropdowGrid />
      </SectionBlock>

      <SectionBlock colorScheme="secondary" py={2} bleeds>
        <H3>Dropdown Menu</H3>
        <DropdowMenuGrid />
      </SectionBlock>
    </React.Fragment>
  )
}
