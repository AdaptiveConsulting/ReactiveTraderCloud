import styled from "styled-components"

import Logo from "@/client/components/logos/AdaptiveLogo"

import designTownPNGURL from "../assets/design-town.png"
import { H1, H3 } from "../elements"
import { Paragraph, SectionBlock } from "../styled"
import { SectionProps } from "../styled/SectionBlock"

const Flex = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 2rem 0;
`

const Content = styled.div`
  flex: 1 1 100%;
  max-width: 24rem;
`

const Background = styled.div`
  flex: 1 1 auto;
  min-height: 12rem;
  min-width: 18rem;
  padding: 2rem 0;
  background-origin: context-box;
  background-image: url(${designTownPNGURL});
  background-position: center left;
  background-size: contain;
`

const H3Intro = styled(H3)`
  margin: 0.5rem 0 1rem 0;
`

export const Introduction = (props: SectionProps) => (
  <>
    <SectionBlock {...props}>
      <Flex>
        <Content>
          <Logo />
          <H3Intro>Design Systems</H3Intro>
          <H1>Adaptive UI Library</H1>
          <Paragraph>
            A quicker, more consistent and collaborative way to design and build
            complex UI&apos;s.
          </Paragraph>
        </Content>
        <Background />
      </Flex>
    </SectionBlock>
    <div>
      <SectionBlock colorScheme="secondary" mh={0.125 / 5} py={0} />
    </div>
  </>
)
