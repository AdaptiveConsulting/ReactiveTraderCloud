import { styled } from 'rt-theme'

export default styled('div')`
  height: calc(100% - 4.75rem);
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 0.25rem 0.25rem 0 0;

  .ag-header {
    border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
    font-size: 0.6875rem;
    text-transform: uppercase;
  }

  .ag-header-container {
    margin-top: 0.75rem;
  }

  .ag-row-odd {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }

  .ag-row-odd:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }

  .ag-row-even:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }

  .rt-blotter__row-pending {
    background-color: ${({ theme }) => theme.core.offBackground};
  }

  .rt-blotter__status-indicator--done {
    width: 0.3125rem !important;
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.template.green.normal};
  }

  .rt-blotter__status-indicator--rejected {
    width: 0.3125rem !important;
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.template.red.normal};
  }

  .rt-blotter__cell-rejected,
  .rt-blotter__cell-done,
  .rt-blotter__cell-pending {
    text-transform: capitalize;
  }

  .rt-blotter__row-rejected:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 0.0625rem solid ${({ theme }) => theme.template.red.normal};
    width: 100%;
  }

  .ag-row {
    transition: none;
  }

  .ag-cell {
    display: flex;
    align-items: center;
  }

  .ag-cell:focus {
    border: none !important;
    outline: none;
  }

  .ag-filter-icon {
    display: none;
  }

  .ag-header-cell-filtered {
    .ag-header-cell-menu-button {
      opacity: 1 !important;
    }
  }

  .ag-cell-label-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .ag-header-cell-label {
      order: -1;
    }

    i {
      padding: 0 0.25rem;
    }
  }

  .ag-header-cell-label i {
    padding: 0 0.25rem;
  }

  .ag-menu {
    background-color: ${({ theme }) => theme.core.darkBackground};
    box-shadow: 0 0 0.3125rem 0 ${({ theme }) => theme.core.textColor};
    border-radius: 0.1875rem;

    .filter-container__checkbox-container {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      font-size: 0.6875rem;

      &:hover {
        background-color: ${({ theme }) => theme.core.alternateBackground};
      }
    }

    .filter_container__select-all-option-container {
      border-bottom: 0.125rem solid ${({ theme }) => theme.core.textColor};
    }

    .filter-container__free-text-input,
    .filter-container__select {
      margin: 0.625rem;
      font-size: 0.6875rem;
      padding: 0.375rem;
      background-color: ${({ theme }) => theme.core.darkBackground};
      border: none;
      border-bottom: 0.0625rem solid ${({ theme }) => theme.core.textColor};
      width: auto;
      outline: none;

      &:focus {
        border-bottom: 0.0625rem solid ${({ theme }) => theme.template.blue.normal};
      }
    }

    option {
      padding: 0.5rem 0.625rem;
    }

    option:hover {
      background-color: ${({ theme }) => theme.core.alternateBackground};
    }

    input[type='checkbox' i] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    label {
      text-transform: capitalize;
    }
  }
`
