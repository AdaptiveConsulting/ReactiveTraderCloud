import styled from "styled-components"

export const IconContainer = styled.div<{ hover: boolean }>`
  border-radius: 50%;
  padding: 4px 6px;
  display: flex;
  justify-content: ${({ hover }) => (hover ? "flex-end" : "center")};
  align-items: center;
  svg {
    height: 20px;
    fill: ${({ theme }) =>
      theme.color[
        "Component colors/Components/Buttons/Primary/button-primary-fg_subtle"
      ]};
  }
`
