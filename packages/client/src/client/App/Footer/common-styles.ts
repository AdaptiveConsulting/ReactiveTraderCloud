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
  background-color: ${({ theme }) => theme.core.alternateBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 1rem;
  margin: 0;
  position: absolute;
  overflow: hidden;
`
