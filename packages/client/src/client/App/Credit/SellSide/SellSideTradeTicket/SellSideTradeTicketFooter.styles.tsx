import styled from "styled-components"

import { Stack } from "@/client/components/Stack"

export const FooterWrapper = styled(Stack)<{
  accepted: boolean
  missed: boolean
  ended: boolean
}>`
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ accepted, missed, ended, theme }) => {
    if (accepted) return theme.color["Colors/Text/text-primary (900)"]
    if (missed) return theme.color["Colors/Text/text-primary (900)"]
    if (ended) return theme.color["Colors/Text/text-tertiary (600)"]
    return
  }};
  background-color: ${({ accepted, missed, ended, theme }) => {
    if (accepted) return theme.color["Colors/Background/bg-success-primary"]
    if (missed) return theme.color["Colors/Background/bg-error-primary"]
    if (ended) return theme.color["Colors/Background/bg-disabled"]
    return
  }};
  border: 1px solid
    ${({ accepted, missed, ended, theme }) => {
      if (accepted) return theme.color["Colors/Border/border-success"]
      if (missed) return theme.color["Colors/Border/border-error"]
      if (ended) return theme.color["Colors/Border/border-disabled"]
      return "none"
    }};
`

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 8px;
`
