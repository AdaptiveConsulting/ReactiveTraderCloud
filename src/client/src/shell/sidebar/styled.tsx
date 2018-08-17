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

export const RegionContainer = styled.div`
  background-color: ${props => props.theme.hover.backgroundColor};
  height: 100%;
  width: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const RegionContent = styled.div`
  width: 24rem;
  min-width: 16rem;
  max-width: 24rem;

  /**/
`

export const RegionElement = styled.div`
  /**/
  width: 100%;
  flex: 1;

  height: 2rem;
  width: 2rem;

  i {
    height: 2rem;
    color: ${props => props.theme.textColor};
    text-align: center;
    padding: 20px 10px;
    cursor: pointer;
  }
`
