import React from 'react'
import { rules } from 'rt-styleguide'
import { styled } from 'test-theme'

export const WindowControls = () => (
  <Layout>
    <Control color="#E95656" />
    <Control color="#FFAD00" />
    <Control color="#28C988" />
  </Layout>
)

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

  background-color: ${p => p.theme.primary['3']};
  border-radius: 100%;

  background-color: ${p => p.color || p.theme.primary['3']};

  ${Layout}:hover & {
    background-color: ${p => p.color || p.theme.primary['3']};
  }
`
