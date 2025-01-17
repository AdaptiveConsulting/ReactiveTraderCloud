import styled from "styled-components"

export const TearOutRouteWrapper = styled("div")`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  overflow: auto;
`
