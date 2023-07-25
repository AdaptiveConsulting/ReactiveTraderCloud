import styled, { css } from "styled-components"

export const Header = styled.h1`
  padding: 12px 0 12px 15px;
  font-size: 16px;
  font-weight: 400;
  color: white;
`

export const Table = styled.table`
  border-bottom: 15px solid ${({ theme }) => theme.core.darkBackground};
  height: calc(100% - 4.75rem);
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  .visually-hidden {
    display: none;
  }
`

export const TableHeadRow = styled.tr`
  position: sticky;
  top: 0;
  display: flex;
  font-size: 0.675rem;
  text-transform: uppercase;
  z-index: 1;
  height: 2rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const TableHeadCell = styled.th<{
  width: number
}>`
  width: ${({ width }) => width}%;
  font-weight: unset;
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    width: 0.675rem;
    vertical-align: text-bottom;
  }

  span.spacer {
    min-width: 0.675rem;
    display: inline-block;
  }

  span.spacer-2 {
    min-width: 1rem;
    display: inline-block;
  }
`
const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

export const TableBodyRow = styled.tr<{
  highlight?: boolean
  index?: number
}>`
  display: flex;
  width: 100%;
  height: 2rem;
  :nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  background-color: ${({ theme, index }) =>
    index && index % 2 === 0 ? undefined : theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

export const TableBodyCell = styled.td<{
  crossed?: boolean
  width: number
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === "right" ? "flex-end" : "flex-start"};
  width: ${({ width }) => width}%;
  &:before {
    content: " ";
    display: ${({ crossed }) => (crossed ? "block" : "none")};
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid red;
    width: 100%;
  }
`

export const StatusIndicator = styled.td<{ status: string }>`
  width: 21px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === "Success" ? accents.positive.base : accents.negative.base}; ;
`

export const StatusIndicatorSpacer = styled.th`
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  width: 21px;
`

export const TableBackground = styled.tbody`
  min-width: 60rem;
`
