import styled from "styled-components"

const Background = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const HeaderWrapper = styled.div``

const BodyWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.newTheme.spacing.lg};
  padding-bottom: 0;
`

export interface RegionLayoutProps {
  Header: JSX.Element
  Body: JSX.Element
}

export const RegionLayout = ({ Header, Body }: RegionLayoutProps) => {
  return (
    <Background role="region">
      <HeaderWrapper>{Header}</HeaderWrapper>
      <BodyWrapper>{Body}</BodyWrapper>
    </Background>
  )
}
