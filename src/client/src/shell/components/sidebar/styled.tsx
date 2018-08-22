import { styled } from 'rt-theme'

export const Root = styled.div`
  flex: 0.1 1 16rem;
  grid-column: minmax(16rem, 24rem);

  min-width: 16rem;
  max-width: 24rem;

  margin: 0.5rem;

  overflow-y: auto;

  display: flex;
  flex-direction: row;

  border-radius: 0.25rem;

  background-color: ${props => props.theme.component.backgroundColor};
  color: ${props => props.theme.component.textColor};
`

export const RegionContent = styled.div`
  margin: 1rem 0.25rem;
  width: 100%;
  min-width: 16rem;
`
