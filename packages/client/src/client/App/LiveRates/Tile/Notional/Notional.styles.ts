import styled from "styled-components"

export const Input = styled.input`
  grid-area: Input;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 83px;
  height: 28px;
  margin-left: ${({ theme }) => theme.newTheme.spacing.xs};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-secondary (700)"]};
  border: 1.5px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-secondary"]};

  &:focus {
    outline: none !important;
    border-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]};
  }
  &:disabled {
    opacity: 0.3;
  }
  &.is-invalid {
    border-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-error-primary (600)"]};
  }
`

export const CurrencyPairSymbol = styled("label")`
  padding-right: ${({ theme }) => theme.newTheme.spacing.xs};
  color: ${({ theme }) => theme.newTheme.color["Colors/Text/text-disabled"]};
  opacity: 0.59;
  font-size: 12px;
  line-height: 1.2rem;
`

export const InputWrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.newTheme.spacing.md};

  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`

export const ErrorMessage = styled.div`
  margin-left: 24px;
  margin-top: 2px;
  padding-top: 2px;
  color: ${({ theme }) => theme.accents.negative.base};
  font-size: 0.6rem;
  line-height: 1;
`

export const ResetInputValue = styled.button<{ isVisible: boolean }>`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-secondary (700)"]};
  display: ${({ isVisible }) => (isVisible ? "inline-flex" : "none")};
  border-radius: 3px;
  margin-left: 8px;
  padding: 2px;
  cursor: pointer;
  font-size: 0.625rem;
  line-height: 1.2rem;
  .flipHorizontal {
    transform: scaleX(-1);
  }
`
