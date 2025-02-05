import styled from "styled-components"

import { Block } from "../styled"
import { SwatchColorProps } from "./CoreBranding"

export const SwatchColor = styled(Block)<SwatchColorProps>`
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;
  padding-right: 5px;

  ${({ extra }) => extra};
`

export const CoreSwatchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 5rem);
  grid-template-areas:
    "base 2"
    "base 3"
    "base1 4"
    "base1 5";

  overflow: hidden;
  border-radius: 0.5rem;

  ${SwatchColor} {
    border-radius: initial;
  }

  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 10rem 7rem;
    grid-template-areas:
      "base base base1 base1"
      "2 3 4 5";
  }
`

export const ThemeRow = styled.div`
  margin: 2rem 0;

  display: grid;
  grid-gap: 0.5rem;
  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;

    ${CoreSwatchGrid}:first-child {
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem !important;
    }

    ${CoreSwatchGrid}:last-child {
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem !important;
    }
  }
`

export const QuadrantLayout = styled.div`
  margin: 30px 0px;
  display: grid;
  grid-row-gap: 1rem;
  grid-column-gap: 0.5rem;

  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;

  @media all and (max-width: 800px) {
    grid-template-columns: auto;
  }
`

export const AccentRowGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr;
  grid-template-rows: 6rem;
`

export const AccentSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6rem;
  grid-template-areas: "base darker medium lighter";
`

export const DominantAccentSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  display: grid;
  grid-template-columns: 49% 26% 25%;
  grid-template-areas: "base darker lighter";
`

export const UniqueRowGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 75%;
  margin-bottom: 1rem;
`

export const UniqueSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  height: min-content;
  display: grid;
  grid-template-rows: 6rem;
  grid-template-columns: 40% 30% 30%;
  grid-template-areas: "base 1 2";
`
