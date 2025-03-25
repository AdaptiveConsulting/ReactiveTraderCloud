import styled from "styled-components"

export const GridLayout = styled.div<{ empty?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: 0;

  ${({ empty }) =>
    empty &&
    `
    flex: 1;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  `}
`
