import styled from "styled-components"

export const HeaderTearOutAction = styled.button`
  svg {
    fill: ${({ theme }) => theme.color["Colors/Text/text-quaternary (500)"]};
  }
  &:hover {
    .tear-out-hover-state {
      fill: #5f94f5;
    }
  }
`
