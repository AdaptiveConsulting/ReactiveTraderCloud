import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"

export const SellSideWrapper = styled.div`
  z-index: 1;
  min-height: 220px;
  max-height: 220px;
  width: 100%;
`

export const NoSelectedWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const NoSelectHeader = styled.div`
  padding: ${({ theme }) => theme.newTheme.spacing.md};
  flex: 0 1 auto;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
`

export const NoSelectedMessage = styled(FlexBox)`
  flex: 1 1 auto;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
`
