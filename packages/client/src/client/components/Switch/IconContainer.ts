import styled from "styled-components"

import { BAM_THEME_BLUE3 } from "@/client/theme/colors"

export const IconContainer = styled.div<{ hover: boolean }>`
  background-color: ${({ theme }) =>
    theme.name === "light" ? theme.core.lightBackground : BAM_THEME_BLUE3};
  color: ${({ theme }) => theme.core.textColor};
  border-radius: 50%;
  height: 1.8rem;
  width: 1.8rem;
  padding: 4px 6px;
  display: flex;
  justify-content: ${({ hover }) => (hover ? "flex-end" : "center")};
  align-items: center;
`
