import { styled } from 'rt-theme'

export const Root = styled.div`
  grid-column: minmax(16rem, 24rem);

  min-width: 16rem;
  max-width: 24rem;

  margin: 0.375rem 1.25rem 0 0.5rem;

  overflow-y: scroll;

  border-radius: 0.1875rem;

  background-color: ${props => props.theme.component.backgroundColor};
  color: ${props => props.theme.component.textColor};
`

export const RegionContent = styled.div``
