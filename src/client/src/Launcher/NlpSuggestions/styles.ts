import styled from "styled-components"

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
        background-color: ${({ theme }) => theme.core.lightBackground};
      }

      &:hover {
        background-color: ${({ theme }) => theme.core.alternateBackground};

        button {
          opacity: 1;
        }
      }
    }
  }
`

export const TableRow = styled.tr<{ status?: "rejected" | "done" | "pending" }>`
  border-left: 0.125rem solid transparent;
  border-left-color: ${({ theme, status }) =>
    status === "done" ? theme.accents.positive.base : "transparent"};

  td {
    position: relative;
    color: ${({ status }) => (status === "rejected" ? "#7f7f7f" : "white")};
    ${({ status }) =>
      status === "rejected" &&
      `
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        border-bottom: 0.0625rem solid #7f7f7f;
        width: 100%;
      };
    `}

    button:hover {
      background-color: #5f94f5;
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
`

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`

export const Response = styled.div`
  font-size: 1rem;
  background: ${({ theme }) => theme.core.darkBackground};
  padding: 0.75rem;
`

export const Intent = styled.div`
  padding-right: 15px;
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
    background-color: ${({ theme }) => theme.core.lightBackground};
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

export const Input = styled.input`
  width: 100%;
  height: 45px;
  background: ${({ theme }) => theme.core.darkBackground};
  outline: none;
  border-radius: 3px 0 0 3px;
  font-size: 1rem;
  font-weight: 400;
  caret-color: transparent;
  transition: all 0.3s ease;

  &::placeholder {
    color: ${({ theme }) => theme.textColor};
    opacity: 0.6;
  }
`

export const CancelButton = styled.button`
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  cursor: pointer;
  z-index: 2;

  svg {
    path:last-child {
      fill: ${({ theme }) => theme.secondary[1]};
    }
  }
`

export const SearchContainer = styled.div`
  position: absolute;
  left: 350px;
  right: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  z-index: 1;
  transition: left 0.3s, right 0.3s, opacity 0.1s ease;
  will-change: opacity;

  &.search-container--active {
    left: 55px;
    opacity: 1;
    right: 83px;

    > input {
      caret-color: #5f94f5;
      padding-left: 9px;
    }
  }
`

export const InlineQuoteContainer = styled.div`
  font-size: 0.6875rem;
`

export const TradeExecutionContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  padding-top: 4px; // top loading bar
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const TradeExecutionActionContainer = styled.div`
  button {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.core.lightBackground};
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

export const TradeResponseContainer = styled.div`
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
  color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 0.2rem;
`
