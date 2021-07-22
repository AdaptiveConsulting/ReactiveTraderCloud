import styled from "styled-components"

const buttonHeight = "2rem"
export const Root = styled.div`
  position: relative;
  float: right;
  backface-visibility: hidden;
  min-height: ${buttonHeight};
  max-height: ${buttonHeight};
  z-index: 20;

  font-size: 0.75rem;

  color: ${(props) => props.theme.textColor};
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
  font-weight: 350;
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
