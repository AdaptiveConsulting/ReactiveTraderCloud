import styled from "styled-components"

export const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) =>
    theme.color["Colors/Border/border-secondary"]};
`
