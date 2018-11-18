import React from 'react'
import { styled } from 'rt-theme'

export interface Props {
  body: React.ReactNode
  aside?: React.ReactNode
}
const BodyLayout: React.FunctionComponent<Props> = ({ body, aside }) => (
  <Layout>
    {body}
    {aside}
  </Layout>
)

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  @media (max-width: 750px) {
    display: block;
  }
  width: 100%;
`

export default BodyLayout
