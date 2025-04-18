import styled from "styled-components"

import { Stack } from "@/client/components/Stack"

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
  padding: ${({ theme }) => theme.spacing.md};
  flex: 0 1 auto;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary"]};
`

export const NoSelectedMessage = styled(Stack)`
  flex: 1 1 auto;
  text-align: center;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
`
