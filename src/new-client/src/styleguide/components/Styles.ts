import styled from "styled-components"

/*
=================
ATOM STYLES
=================
*/

export const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 2rem repeat(2, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
  justify-content: flex-start;
`

export const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
  & > div {
    font-size: 0.875rem;
  }
`

export const SpreadTilesColumn = styled(GridColumn)`
  min-width: 10rem;
`
export const SpreadTilesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0.5rem;
`

export const Root = styled.div`
  max-width: 60rem;
  display: grid;
  grid-template-columns: minmax(auto, 80px) 1fr;
  grid-column-gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.primary[3]};

  ${SpreadTilesColumn} + ${SpreadTilesColumn} {
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`

/*
=================
MOLECULES STYLES
=================
*/

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 120px 320px 320px;
  grid-column-gap: 43px;
  grid-row-gap: 17px;
`
export const Cell = styled.div`
  display: grid;
  grid-template-rows: 15px 175px;
  grid-row-gap: 9px;
`
export const FxSpot = styled.div`
  grid-row: 1 / span 2;
`
export const FxRfq = styled.div`
  grid-row: 4 / span 4;
`
export const Separator = styled.hr`
  grid-column: 1 / -1;
  border: none;
  border-bottom: ${({ theme }) =>
    `2px solid ${theme.core.primaryStyleGuideBackground}`};
  margin: 4rem 0;
`
