import styled from "styled-components"

const Body = styled.div`
  height: calc(100% - var(--header-height) - var(--footer-height));
`

export const WindowBody: React.FC = () => (
  <Body>
    <div id="layout-container" />
  </Body>
)
