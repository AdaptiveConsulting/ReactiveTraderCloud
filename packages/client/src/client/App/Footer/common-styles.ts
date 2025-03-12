import styled from "styled-components"

export const Root = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  float: right;
  backface-visibility: hidden;
  z-index: 20;
`

export const Background = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 5;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color["Colors/Background/bg-primary"]};
  border: 1px solid
    ${({ theme }) => theme.color["Colors/Border/border-primary"]};
`
