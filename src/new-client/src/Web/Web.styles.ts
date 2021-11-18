import styled from "styled-components"

export const TearOutRouteWrapper = styled("div")`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: auto;
`
export const Flex = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`
