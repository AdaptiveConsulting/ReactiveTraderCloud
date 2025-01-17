import styled from "styled-components"

export const Root = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  float: right;
  backface-visibility: hidden;
  z-index: 20;
`

export const Button = styled.button<{ margin?: string; disabled?: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 15rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-items: center;
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  padding: 0 0.7rem;
  height: 1.6rem;
  font-size: 0.65rem;
  font-weight: 300;
  margin: ${({ margin }) => (margin ? margin : "unset")};
`

export const Background = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 5;
  border-radius: ${({ theme }) => theme.newTheme.radius.lg};
  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  border: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
`
