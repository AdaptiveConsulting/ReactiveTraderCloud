import { styled } from 'rt-theme'

export const Root = styled.div`
  flex: 0.1 1 16rem;
  overflow-y: auto;
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  display: flex;
  flex-direction: row;
`

export const RegionContent = styled.div`
  width: 100%;
  min-width: 16rem;
  max-width: 24rem;
`
