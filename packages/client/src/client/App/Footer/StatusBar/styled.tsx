import styled from "styled-components"

const headerHeight = "2rem"

export const Root = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-height: ${headerHeight};
  max-height: ${headerHeight};
  z-index: 20;
  height: 2rem;
  padding: 0 1rem;
  gap: ${({ theme }) => theme.newTheme.spacing.sm};
`
