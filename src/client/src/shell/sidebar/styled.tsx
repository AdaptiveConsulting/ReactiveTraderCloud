import { styled } from 'rt-theme'

export const Root = styled.div`
  margin: 0.5rem;
  border-radius: 0.25rem;
  flex: 0.1 1 16rem;
  overflow-y: auto;
  background-color: ${props => props.theme.component.backgroundColor};
  color: ${props => props.theme.component.textColor};

  display: flex;
  flex-direction: row;
`

export const RegionContent = styled.div`
  margin: 1rem 0.25rem;
  width: 100%;
  min-width: 16rem;
  max-width: 24rem;
`
