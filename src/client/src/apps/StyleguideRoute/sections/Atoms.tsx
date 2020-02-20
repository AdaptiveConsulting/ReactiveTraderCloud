import React from 'react'
import FormGrid from '../components/FormGrid'
import PricingTilesGrid from '../components/PricingTilesGrid'
import ChartingGrid from '../components/ChartingGrid'
import { H2, H3, H5, NumberedLayout } from '../elements'
import { Paragraph, SectionBlock } from '../styled'

export const layout = React.Fragment
export const props = {}

export default () => {
  return (
    <React.Fragment>
      <SectionBlock mh={3}>
        <NumberedLayout number="2">
          <H5>Design Systems Thinking</H5>
          <H2>Trading Tiles - Atoms</H2>
          <Paragraph>
            DS-4: A collection of atoms together form a molecule in theory these are now becoming
            more sophisticated usable components in a UI.
          </Paragraph>
        </NumberedLayout>
      </SectionBlock>

      <SectionBlock colorScheme="secondary" py={2} bleeds>
        <H3>Pricing Tiles</H3>
        <H5>FX</H5>
        <PricingTilesGrid />
        <ChartingGrid />
      </SectionBlock>

      <SectionBlock colorScheme="secondary" py={2} bleeds>
        <H3>Form Elements</H3>
        <FormGrid />
      </SectionBlock>
    </React.Fragment>
  )
}
