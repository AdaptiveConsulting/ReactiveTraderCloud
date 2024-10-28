import styled from "styled-components"

export const IconContainer = styled.div<{ hover: boolean }>`
  border-radius: 50%;
  height: 1.8rem;
  width: 1.8rem;
  padding: 4px 6px;
  display: flex;
  justify-content: ${({ hover }) => (hover ? "flex-end" : "center")};
  align-items: center;
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color[
        "Component colors/Components/Buttons/Primary/button-primary-fg_subtle"
      ]};
  }
`
