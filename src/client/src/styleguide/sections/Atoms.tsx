import styled from "styled-components"
import { H2, H3 } from "../elements"
import { Paragraph, SectionBlock } from "../styled"
import FormGrid from "../components/FormGrid"
import PricingTilesGrid from "../components/PricingTilesGrid"
import ChartingGrid from "../components/ChartingGrid"
import ButtonGrid from "../components/ButtonGrid"
import SpreadGrid from "../components/SpreadGrid"
import ConfirmationGrid from "../components/ConfirmationGrid"
import DropdownGrid from "../components/DropdowGrid"
import DropdownMenuGrid from "../components/DropdownMenuGrid"
import ListItemGrid from "../components/ListItemGrid"

const Atoms = () => {
  return (
    <>
      <SectionBlock py={0} pt={2} mh={0}>
        <H2 pt={4}>Atoms</H2>
        <Paragraph>
          Atoms are the lowest level of a UI such as a button, text link, input
          field etc. Atoms are placed together to create a specific piece of
          functionality. All controls are scalable in height and width so as to
          accomodate a compact or spacious UI preference.
        </Paragraph>
      </SectionBlock>

      <SectionBlock py={0} pt={2} mh={0}>
        <H3>Buttons</H3>
        <ButtonGrid />
        <H3>Combo Box</H3>
        <DropdownGrid />
        <H3>Input Fields</H3>
        <FormGrid />
        <H3>List Items - Combo Box</H3>
        <ListItemGrid />
        <H3>Window Containers</H3>
        <WindowContainers>
          <label>Overlays</label>
          <div />
        </WindowContainers>
        <H3>Combo box Menu</H3>
        <DropdownMenuGrid />
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
    </>
  )
}

export default Atoms

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

const WindowContainers = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;

  label {
    font-size: 11px;
  }

  div {
    background-color: ${({ theme }) => theme.core.dividerColor};
    width: 120px;
    height: 128px;
    border-radius: 3px;
    box-shadow: 0 0.25rem 0.375rem rgba(50, 50, 93, 0.11),
      0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08);
  }
`
