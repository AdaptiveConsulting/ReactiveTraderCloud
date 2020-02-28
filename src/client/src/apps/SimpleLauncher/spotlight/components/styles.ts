import { styled } from 'rt-theme'
import { rules } from 'rt-styleguide'

export const Table = styled.table`
  font-size: 0.6875rem;
  th,
  td {
    text-align: left;
    width: 100px;
    padding: 0 5px;
  }

  thead tr {
    text-transform: uppercase;
  }

  tbody {
    tr:nth-child(odd) {
      background-color: ${({ theme }) => theme.core.darkBackground};
    }

    tr:nth-child(even) {
      background-color: ${({ theme }) => theme.core.alternateBackground};
    }
  }
`

export const Suggestion = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 2px;
  line-height: 1rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`

export const Response = styled.div`
  font-size: 1rem;
  font-style: italic;
  opacity: 0.59;
  ${rules.appRegionNoDrag};
`

export const Intent = styled.div`
  padding-right: 15px;
`

export const InlineIntent = styled.div`
  font-size: 0.6875rem;
  padding-left: 15px;
  border-left: solid;
`

export const Input = styled.input`
  width: 100%;
  height: 45px;
  background: #2b2b2b;
  outline: none;
  border-radius: 3px 0 0 3px;
  font-size: 1rem;
  font-weight: 400;
  caret-color: transparent;
  ${rules.appRegionNoDrag};
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
  background-color: #3f3f3f;
  cursor: pointer;
  z-index: 2;
`

export const SearchContainer = styled.div`
  background-color: #313131;
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
      caret-color: #8c7ae6;
      padding-left: 9px;
    }
  }
`

export const InlineQuoteContainer = styled.div`
  font-size: 0.6875rem;
`
