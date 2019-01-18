import { styled } from 'rt-theme'

export const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

export const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`

export const WorkspaceWrapper = styled(Wrapper)`
  padding-right: 0;
  height: 100%;
`

export const AnalyticsWrapper = styled(Wrapper)`
  padding-left: 0;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`

export const BlotterWrapper = styled(Wrapper)`
  height: 100%;
`
