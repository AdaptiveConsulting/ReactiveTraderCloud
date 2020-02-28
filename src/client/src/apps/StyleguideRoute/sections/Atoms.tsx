import React from 'react'
import FormGrid from '../components/FormGrid'
import { styled } from 'rt-theme'
import PricingTilesGrid from '../components/PricingTilesGrid'
import ChartingGrid from '../components/ChartingGrid'
import { H2, H3 } from '../elements'
import { Paragraph, SectionBlock } from '../styled'
import ButtonGrid from '../components/ButtonGrid'
import SpreadGrid from '../components/SpreadGrid'
import ConfirmationGrid from '../components/ConfirmationGrid'

export const layout = React.Fragment
export const props = {}

export default () => {
  return (
    <React.Fragment>
      <SectionBlock py={0} pt={2} mh={0}>
        <H2 pt={4}>Atoms</H2>
        <Paragraph>
          Atoms are the lowest level of a UI such as a button, text link, input field etc. Atoms are
          placed together to create a specific piece of functionality. All controls are scalable in
          height and width so as to accomodate a compact or spacious UI preference.
        </Paragraph>
      </SectionBlock>

      <SectionBlock py={0} pt={2} mh={0}>
        <H3>Buttons</H3>
        <ButtonGrid />
        <H3>Input Fields</H3>
        <FormGrid />
      </SectionBlock>

      <SectionBlock py={2} bleeds>
        <Separator />
        <H3>Pricing Tiles</H3>
        <AtomsContainer>
          <PricingTilesGrid />
          <SpreadGrid />
          <ChartingGrid />
          <ConfirmationGrid />
        </AtomsContainer>
      </SectionBlock>
    </React.Fragment>
  )
}

const AtomsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8rem;
  margin-top: 2rem;

  & > div:first-child {
    grid-row: 1 / 4;
  }
`

const Separator = styled.hr`
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.primary[3]};
  margin: 4rem 0;
`
