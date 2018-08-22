import React from 'react'
import { styled } from 'rt-theme'

export interface Props {
  body: React.ReactNode
  aside?: React.ReactNode
}
const BodyLayout: React.SFC<Props> = ({ body, aside }) => (
  <Layout>
    {body}
    {aside}
  </Layout>
)

const Layout = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: minmax(min-content, 1fr) auto;

  align-items: stretch;
  justify-content: stretch;
`

export default BodyLayout
