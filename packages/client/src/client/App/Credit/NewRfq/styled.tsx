import styled from "styled-components"

export const Form = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
  padding: ${({ theme }) => theme.newTheme.spacing["2xl"]}
    ${({ theme }) => theme.newTheme.spacing.lg};
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
`
