import styled from "styled-components"

import { Footer } from "@/App/Footer"
import Header from "@/App/Header"
import { WithChildren } from "@/utils/utilityTypes"

const Wrapper = styled("div")`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`
const AppLayoutRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
`
const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

const MainLayout = ({ children }: WithChildren) => (
  <Wrapper>
    <AppLayoutRoot data-qa="app-layout__root">
      <Header />
      <MainWrapper>{children}</MainWrapper>
      <Footer />
    </AppLayoutRoot>
  </Wrapper>
)
export default MainLayout
