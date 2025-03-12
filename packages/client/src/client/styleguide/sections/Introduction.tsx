import styled from "styled-components"

import Logo from "@/client/components/logos/AdaptiveLogo"
import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"

import adaptiveExpertisePNGURL from "../assets/Adaptive-expertise.png"
import { SectionBlock } from "../styled"
import { SectionProps } from "../styled/SectionBlock"

const Content = styled.div`
  flex: 1 1 100%;
  max-width: 24rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.newTheme.spacing.md};
`

const Background = styled.div`
  flex: 1 1 auto;

  min-height: 25rem;
  background-image: url(${adaptiveExpertisePNGURL});
  background-size: contain;
`

export const Introduction = (props: SectionProps) => (
  <SectionBlock {...props}>
    <Stack alignItems="center">
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
    </Stack>
  </SectionBlock>
)
