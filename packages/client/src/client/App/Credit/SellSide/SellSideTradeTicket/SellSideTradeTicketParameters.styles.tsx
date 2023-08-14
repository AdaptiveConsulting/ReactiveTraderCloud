import styled from "styled-components"

import { ThemeName } from "@/client/theme"

export const ParametersWrapper = styled.div`
  padding: 8px;
  overflow-y: auto;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const ParameterLabel = styled.div`
  color: ${({ theme }) => theme.secondary[5]};
  margin-bottom: 4px;
`

export const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 1]};
`

export const PendingPrice = styled.span`
  margin-right: 6px;
  color: ${({ theme }) => theme.accents.primary.base};
`

export const ParameterInput = styled.input`
  outline: none;
  height: 24px;
  width: 100%;
  padding: 4px;
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 1]};
  background-color: ${({ theme }) => theme.core.darkBackground};
  border: 1px solid ${({ theme }) => theme.colors.light.primary[3]};
  border-radius: 3px;
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.darker};
  }
  ¯ &:disabled {
    opacity: 0.3;
  }
  &.is-invalid {
    border-color: ${({ theme }) => theme.accents.negative.base};
  }
`
