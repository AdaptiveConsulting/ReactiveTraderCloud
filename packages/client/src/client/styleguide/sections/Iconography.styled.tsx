import styled from "styled-components"

export const Table = styled.table`
  border-collapse: collapse;

  thead th {
    padding: ${({ theme }) => theme.newTheme.spacing.xl};
  }

  td,
  th {
    border-bottom: 1px solid
      ${({ theme }) => theme.newTheme.color["Colors/Border/border-secondary"]};
  }

  tbody th {
    text-align: start;
  }

  td {
    text-align: center;
    padding: ${({ theme }) => theme.newTheme.spacing.lg}
      ${({ theme }) => theme.newTheme.spacing.md};
  }
`

const Container = styled.td`
  svg {
  }
`

export const NormalContainer = styled(Container)`
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-secondary (700)"]};
`

export const HoverContainer = styled(Container)`
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-brand-primary (900)"]};
`

export const DisabledContainer = styled(Container)`
  color: ${({ theme }) => theme.newTheme.color["Colors/Text/text-disabled"]};
`
