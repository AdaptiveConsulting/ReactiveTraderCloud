import styled from "styled-components"

export const TicketWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
  padding: ${({ theme }) => theme.newTheme.spacing["2xl"]}
    ${({ theme }) => theme.newTheme.spacing.lg};
`
