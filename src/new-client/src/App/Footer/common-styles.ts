import styled from "styled-components/macro"

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

export const Button = styled.div<{ margin?: string }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 15rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  padding: 0 0.7rem;
  height: 1.6rem;
  font-size: 0.65rem;
  font-weight: 350;
  margin: ${({ margin }) => (margin ? margin : "unset")};
`
