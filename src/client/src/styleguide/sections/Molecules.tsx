import { H2 } from "../elements"
import { Paragraph, SectionBlock } from "../styled"
import SpotTilesGrid from "../components/SpotTilesGrid"

const Molecules = () => (
  <>
    <SectionBlock colorScheme="secondary" py={0} pt={2} mh={0}>
      <H2 pt={4}>Molecules</H2>
      <Paragraph>
        Molecules use a combination of atoms to form a more relevant and
        slightly more unique reusable component.
      </Paragraph>
    </SectionBlock>
    <SectionBlock colorScheme="secondary" py={2} bleeds>
      <SpotTilesGrid />
    </SectionBlock>
  </>
)

export default Molecules
