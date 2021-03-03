import Resizer from "components/Resizer"
import styled from "styled-components/macro"
import Header from "./Header"
import { Footer } from "./Footer"
import { LiveRates } from "./LiveRates"
import { Trades } from "./Trades"
import { Analytics } from "./Analytics"

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

const MainOuter = styled.div`
  display: flex;
  overflow: hidden;
`

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  @media (max-width: 750px) {
    display: block;
  }
  width: 100%;
`

export const App: React.FC = () => (
  <Wrapper>
    <AppLayoutRoot data-qa="app-layout__root">
      <Header />
      <MainOuter>
        <MainWrapper>
          <Resizer defaultHeight={30}>
            <LiveRates />
            <Trades />
          </Resizer>
          <Analytics />
        </MainWrapper>
      </MainOuter>
      <Footer />
    </AppLayoutRoot>
  </Wrapper>
)
