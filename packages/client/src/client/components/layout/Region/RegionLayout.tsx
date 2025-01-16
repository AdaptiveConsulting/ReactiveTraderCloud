import styled from "styled-components"

import { LayoutProps } from "../types"

const Background = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const HeaderWrapper = styled.div``

const BodyWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

export const RegionLayout = ({ Header, Body, className }: LayoutProps) => {
  return (
    <Background className={className} role="region">
      <HeaderWrapper>{Header}</HeaderWrapper>
      <BodyWrapper>{Body}</BodyWrapper>
    </Background>
  )
}
