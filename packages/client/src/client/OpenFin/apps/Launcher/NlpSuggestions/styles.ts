import styled from "styled-components"

import { TradeStatus } from "@/services/trades"

export const PlatformLogoWrapper = styled.div`
  svg {
    fill: #ffffff;
  }
`
export const Table = styled.table`
  font-size: 0.6875rem;
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.5rem;
  }

  th {
    font-weight: bold;
  }

  thead tr {
    text-transform: uppercase;
  }

  tbody {
    svg {
      display: block;
      margin: auto;
    }

    tr {
      button {
        opacity: 0;
        padding: 0.5rem;
        width: 5rem;
      }

      &:nth-child(odd) {
        background-color: ${({ theme }) =>
          theme.newTheme.color["Colors/Background/bg-secondary"]};
      }

      &:hover {
        background-color: ${({ theme }) =>
          theme.newTheme.color["Colors/Background/bg-secondary_hover"]};

        button {
          opacity: 1;
        }
      }
    }
  }
`

export const TableRow = styled.tr<{ status?: TradeStatus }>`
  border-left: 0.125rem solid transparent;
  border-left-color: ${({ theme, status }) =>
    status === TradeStatus.Done
      ? theme.newTheme.color[
          "Component colors/Utility/Success/utility-success-500"
        ]
      : "transparent"};

  td {
    position: relative;
    color: ${({ status, theme }) =>
      status === TradeStatus.Rejected
        ? theme.newTheme.color["Colors/Text/text-disabled"]
        : "white"};
    ${({ status, theme }) =>
      status === TradeStatus.Rejected &&
      `
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        border-bottom: 0.0625rem solid ${theme.newTheme.color["Colors/Border/border-primary"]};
        width: 100%;
      };
    `}

    button:hover {
      background-color: ${({ theme }) =>
        theme.newTheme.color[
          "Component colors/Components/Buttons/Brand/button-brand-bg_hover"
        ]};
    }
  }
`

export const TableCell = styled.td<{
  align?: "center" | "right"
  fixedWidth?: boolean
}>`
  text-align: ${({ align }) => (align ? align : "left")};
  width: ${({ fixedWidth }) => (fixedWidth ? "4rem" : "unset")};
  text-transform: capitalize;
`
export const TableHeader = styled.th`
  text-align: ${({ align }) => (align ? align : "left")};
`

export const Suggestion = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 2px;
  line-height: 1rem;
  max-height: 800px;
  overflow: auto;
`

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`

export const InlineIntent = styled.div`
  width: 100%;
`
export const LogoWrapper = styled.div`
  border-radius: 3px;
  background-color: #27578c;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`

export const IntentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const IntentActionWrapper = styled(IntentWrapper)`
  flex-direction: row;
  align-items: center;
`
export const IntentActions = styled(IntentActionWrapper)`
  margin-bottom: 1rem;
  button {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-secondary"]};
    &:first-of-type {
      border-radius: 3px 0 0 3px;
    }
    &:last-of-type {
      border-radius: 0 3px 3px 0;
    }
    &:hover {
      background-color: #5f94f5;
    }
  }
`

export const NlpExecutionContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  padding-top: 4px; // top loading bar
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const NlpExecutionActionContainer = styled.div`
  button {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary"]}};
    &:first-of-type {
      border-radius: 3px 0 0 3px;
    }
    &:last-of-type {
      border-radius: 0 3px 3px 0;
    }
    &:hover {
      background-color: #5f94f5;
    }
  }
`

export const NlpResponseContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
`

export const HelpText = styled.div`
  font-size: 0.9rem;
`

export const Pill = styled.div`
  padding: 0.2rem 0.4rem;
  display: inline-block;
  background-color: #5f94f5;
  color: ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary"]}};
  border-radius: 0.2rem;
`
