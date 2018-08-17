import { styled } from 'rt-theme'

export const Root = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  overflow-y: auto;
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  display: flex;
  flex-direction: row;
`

export const RegionContent = styled.div`
  width: 24rem;
  min-width: 16rem;
  max-width: 24rem;
`
