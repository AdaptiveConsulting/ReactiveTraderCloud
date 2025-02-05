import styled from "styled-components"

import Logo from "@/client/components/Logo"
import { Typography } from "@/client/components/Typography"

import designTownPNGURL from "../assets/design-town.png"
import { SectionBlock } from "../styled"
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.newTheme.spacing.md};
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

const Introduction = (props: SectionProps) => (
  <SectionBlock {...props}>
    <Flex>
      <Content>
        <Logo />
        <Typography variant="Display md/Regular">Design Systems</Typography>
        <Typography variant="Display xl/Bold">
          {"Adaptive UI Library".toUpperCase()}
        </Typography>
        <Typography variant="Text lg/Regular">
          A quicker, more consistent and collaborative way to design and build
          complex UI&apos;s.
        </Typography>
      </Content>
      <Background />
    </Flex>
  </SectionBlock>
)

export default Introduction
