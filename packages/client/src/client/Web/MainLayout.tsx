import { Outlet } from "react-router-dom"
import styled from "styled-components"

import { Footer } from "@/client/App/Footer"
import Header from "@/client/App/Header"

const Wrapper = styled("div")`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  width: 100%;
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
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  border: ${({ theme }) =>
    `${theme.newTheme.spacing.sm} ${theme.newTheme.color["Colors/Background/bg-primary"]} solid`};
`
const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

const MainLayout = () => (
  <Wrapper>
    <AppLayoutRoot data-qa="app-layout__root">
      <Header />
      <MainWrapper>
        <Outlet />
      </MainWrapper>
      <Footer />
    </AppLayoutRoot>
  </Wrapper>
)
export default MainLayout
