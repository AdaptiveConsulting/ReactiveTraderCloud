import styled from 'styled-components/macro'
import { Loader } from 'components/Loader'

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`

const WorkspaceWrapper = styled(Wrapper)`
  padding-right: 0;
  height: 100%;

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

export const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

export const LiveRates: React.FC = () => (
  <WorkspaceWrapper>
    <OverflowScroll>
      <Loader />
    </OverflowScroll>
  </WorkspaceWrapper>
)
