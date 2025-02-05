import styled from "styled-components"

import { Box } from "@/client/components/Box"

export const Table = styled.table`
  margin-bottom: ${({ theme }) => theme.newTheme.spacing["4xl"]};

  th {
    text-align: start;
    padding-bottom: ${({ theme }) => theme.newTheme.spacing.md};
  }

  tr:first-child {
    th {
      padding-bottom: ${({ theme }) => theme.newTheme.spacing["xl"]};
      text-align: start;
    }
  }
  td {
    padding-right: ${({ theme }) => theme.newTheme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.newTheme.spacing.md};
  }
`

export const FontFamilySampleGrid = styled(Box)`
  display: grid;
  grid-template-columns: minmax(auto, 0.2fr) 1fr;
  grid-column-gap: 5rem;
  max-width: 100%;
  overflow: hidden;
`

export const CharacterLine = styled(Box)`
  @media all and (max-width: 480px) {
    max-width: 90%;
    line-height: 1.5rem;
    margin-bottom: 0.75rem;
  }
  @media all and (min-width: 640px) {
  }
`
