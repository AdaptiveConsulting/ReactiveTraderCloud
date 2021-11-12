import styled from "styled-components"

export const StyledButton = styled.button<{
  iconFill?: string
  iconHoverFill?: string
  iconHoverBackground?: string
  active?: boolean
}>`
  width: 40px;
  height: ${({ active }) => (active ? "40px" : "45px")};
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;

  border-radius: 4px;
  background-color: ${({ iconHoverBackground, active }) =>
    active ? iconHoverBackground : "inherited"};

  svg {
    fill: ${({ iconFill }) => iconFill};
  }

  &:hover {
    height: 45px;
    background-color: ${({ iconHoverBackground }) => iconHoverBackground};
    justify-content: ${({ title }) =>
      title === "Search ecosystem" ? "center" : "start"};
    padding-top: ${({ title }) =>
      title === "Search ecosystem"
        ? "0"
        : title === "Launch Excel"
        ? "2.5px"
        : "6px"};

    svg {
      fill: ${({ iconHoverFill }) => iconHoverFill};
    }
    span {
      color: ${({ theme }) => theme.core.textColor};
    }
  }
`
