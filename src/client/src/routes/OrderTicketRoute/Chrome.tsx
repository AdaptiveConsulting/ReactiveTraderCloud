import React from 'react'
import { rules } from 'rt-styleguide'
import { styled } from 'rt-theme'
import { Block, Text } from '../StyleguideRoute/styled/index'

export const Chrome = () => (
  <ChromeLayout bg={t => t.primary.base}>
    <Layout>
      <Control color="#E95656" />
      <Control color="#FFAD00" />
      <Control color="#28C988" />
    </Layout>
    <Text letterSpacing={1} fontSize={0.75} fontWeight={300}>
      Order Ticket
    </Text>
  </ChromeLayout>
)

const ChromeLayout = styled(Block)`
  grid-area: chrome;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: min-content 1fr auto;
  align-items: center;
  grid-gap: 1rem;
  padding: 0 1rem;

  height: 2rem;

  ${rules.appRegionDrag};
`

const Layout = styled.div`
  width: min-content;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
`

const Control = styled.div<{ color?: string }>`
  ${rules.userSelectButton};

  width: 0.75rem;
  height: 0.75rem;

  background-color: ${p => p.theme.primary[3]};
  border-radius: 100%;

  background-color: ${p => p.color || p.theme.primary[3]};

  ${Layout}:hover & {
    background-color: ${p => p.color || p.theme.primary[3]};
  }
`
