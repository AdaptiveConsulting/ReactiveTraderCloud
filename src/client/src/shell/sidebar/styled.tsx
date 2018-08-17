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
  /*
    ${props => props.theme.hover.backgroundColor}: #30333a;
    ${props => props.theme.backgroundColor}: #262a33;
    ${props => props.theme.shadowColor}: #424545;
    $button-height: 50px;

  
  
  
  */

  background-color: ${props => props.theme.hover.backgroundColor};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.no-content {
    display: none;
  }

  .sidebar-region__container--no-content {
  }

  .sidebar-region__element {
  }

  .sidebar-region__element--active {
  }

  .sidebar-region__element--inactive {
  }

  .sidebar-region__element-button {
  }
`

export const RegionContent = styled.div`
  width: 24rem;
  min-width: 16rem;
  max-width: 24rem;

  /**/
`

export const RegionElement = styled.div`
  /**/

  border-left: 1px solid ${props => props.theme.shadowColor};
  width: 100%;
  flex: 1;

  &.active {
    background-color: ${props => props.theme.backgroundColor};
    border: 1px solid ${props => props.theme.shadowColor};
    border-left-color: ${props => props.theme.backgroundColor};
    &:hover {
      background-color: ${props => props.theme.hover.backgroundColor};
      border-right-color: ${props => props.theme.shadowColor};
    }
  }

  &.inactive {
    border: 1px solid ${props => props.theme.hover.backgroundColor};
    border-left-color: ${props => props.theme.shadowColor};
    background-color: ${props => props.theme.hover.backgroundColor};
    &:hover {
      background-color: ${props => props.theme.backgroundColor};
      border-bottom-color: ${props => props.theme.shadowColor};
      border-top-color: ${props => props.theme.shadowColor};
    }
  }

  i {
    height: $button-height;
    color: white;
    text-align: center;
    padding: 20px 10px;
    cursor: pointer;
  }
`
