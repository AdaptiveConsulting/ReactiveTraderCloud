import styled from "styled-components"

export const FooterWrapper = styled.div<{ accepted: boolean; missed: boolean }>`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.newTheme.radius.sm};
  background-color: ${({ accepted, missed, theme }) =>
    accepted
      ? theme.newTheme.color["Colors/Background/bg-success-secondary"]
      : missed
        ? theme.newTheme.color["Colors/Background/bg-error-primary"]
        : undefined};
`

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 8px;
`
