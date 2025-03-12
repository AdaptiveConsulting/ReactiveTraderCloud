import styled from "styled-components"

export const InstrumentSearchWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
`

export const InputWrapper = styled.div`
  position: relative;
  flex: 1 1 0;
`

export const IconWrapper = styled.div`
  position: absolute;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  height: 30px;
  width: 30px;
  color: ${({ theme }) => theme.color["Colors/Text/text-quaternary (500)"]};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) =>
      theme.color["Colors/Text/text-brand-primary (900)"]};
  }
`

export const SearchWrapper = styled.div`
  position: relative;
`
export const SearchResultsWrapper = styled.div`
  position: absolute;
  top: 35px;
  z-index: 1000;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
`

export const SearchResultItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  margin: 6px;
  &[aria-selected="true"] {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-primary_hover"]};
  }
`
