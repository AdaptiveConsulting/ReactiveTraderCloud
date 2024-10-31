import styled from "styled-components"

export const LogoWrapper = styled.div`
  line-height: 0;
  padding-right: ${({ theme }) => theme.newTheme.spacing["2xl"]};
  &:hover {
    cursor: pointer;
  }
`

export const AppHeaderWrapper = styled.div`
  position: relative;
`

export const AppHeaderRoot = styled.div`
  width: calc(100% - 2rem);
  max-width: 100%;
  height: var(--header-height, 3.5rem);
  padding: 0 ${({ theme }) => theme.newTheme.spacing.lg};

  display: flex;
  align-items: center;

  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) => theme.core.textColor};

  position: relative;
  z-index: 5;
`

export const HeaderNav = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: ${({ theme }) => theme.newTheme.spacing["xl"]};
`

export const Fill = styled.div`
  flex: 1;
  height: calc(3.5rem - 5px);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: normal;
  opacity: 0.58;
  font-size: 0.625rem;
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

export const InstrumentTypeSelectorWrapper = styled.div`
  margin-right: auto;
`
