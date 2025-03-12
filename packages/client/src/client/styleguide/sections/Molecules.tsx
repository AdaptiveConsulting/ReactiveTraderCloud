import SpotTilesGrid from "../components/SpotTilesGrid"
import { H2, P } from "../elements"
import { SectionBlock } from "../styled"

export const Molecules = () => (
  <>
    <SectionBlock colorScheme="secondary" mh={0}>
      <H2>Molecules</H2>
      <P paddingBottom="3xl">
        Molecules use a combination of atoms to form a more relevant and
        slightly more unique reusable component.
      </P>

      <SpotTilesGrid />
    </SectionBlock>
  </>
)
