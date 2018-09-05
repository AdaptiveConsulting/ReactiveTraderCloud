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
  display: grid;
  grid-template-columns: 1fr minmax(20rem, auto);
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  width: 100%;
`

export default BodyLayout
