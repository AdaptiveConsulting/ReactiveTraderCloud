import styled from "styled-components"

import { LayoutProps } from "./types"

const Background = styled.div`
  padding: ${({ theme }) => theme.newTheme.spacing.xl};
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const BodyWrapper = styled.div``

export const SectionLayout = ({ Header, Body, style }: LayoutProps) => (
  <Background style={style}>
    <HeaderWrapper>{Header}</HeaderWrapper>
    <BodyWrapper>{Body}</BodyWrapper>
  </Background>
)
