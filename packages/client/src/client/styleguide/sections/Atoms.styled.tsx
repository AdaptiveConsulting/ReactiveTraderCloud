import styled from "styled-components"

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead th {
    padding: ${({ theme }) => theme.newTheme.spacing.xl};
  }

  td,
  th {
    // border-bottom: 1px solid
    //   ${({ theme }) =>
      theme.newTheme.color["Colors/Border/border-secondary"]};
  }

  tbody th {
    text-align: start;
  }

  tr,
  th {
    text-transform: capitalize;
  }

  td {
    padding: ${({ theme }) => theme.newTheme.spacing.lg}
      ${({ theme }) => theme.newTheme.spacing.md};
  }
`
