import styled from "styled-components"

import { LayoutProps } from "../types"

const Background = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const BodyWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary_alt"]};
`

export const RegionLayout = ({ Header, Body, className }: LayoutProps) => {
  return (
    <Background className={className} role="region">
      {Header}
      <BodyWrapper>{Body}</BodyWrapper>
    </Background>
  )
}
