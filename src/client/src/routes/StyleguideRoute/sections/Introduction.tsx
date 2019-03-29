import React from 'react'
import { styled } from 'rt-theme'

import designTownPNGURL from '../assets/design-town.png'

import { H1, H3 } from '../elements'
import { Paragraph, SectionBlock } from '../styled'

export const Introduction: React.FC = props => (
  <React.Fragment>
    <SectionBlock colorScheme="secondary" {...props}>
      <Flex>
        <Content>
          <H3>Design Systems</H3>
          <H1>Adaptive UI Library</H1>
          <Paragraph>A quicker, more consistent and collaborative way to design and build complex UI's.</Paragraph>
        </Content>
        <Background />
      </Flex>
    </SectionBlock>
    <SectionBlock mh={0} py={0}>
      <Paragraph>
        <i>
          <strong>Notes & Instructions</strong>: Build up a consistent color profile for your application by selecting a
          few base colors to work from. The collection below is setup in such a way that it will generate the varying
          color scales for you. From this spectrum you should color pick and define the final color values to be used in
          your user interface.
        </i>
      </Paragraph>
    </SectionBlock>
    <div>
      <SectionBlock colorScheme="secondary" mh={0.125 / 5} py={0} />
    </div>
  </React.Fragment>
)

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

export default Introduction
