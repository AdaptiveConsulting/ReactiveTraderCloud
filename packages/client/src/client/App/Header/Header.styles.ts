import styled from "styled-components"

export const BAM_THEME_RED = "#c41230;"

export const LogoWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`

export const AppHeaderWrapper = styled.div`
  position: relative;
  background-color: ${BAM_THEME_RED};
`

export const AppHeaderRoot = styled.div`
  width: calc(100% - 2rem);
  max-width: 100%;

  height: var(--header-height, 3.5rem);

  margin: 0.25rem 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${BAM_THEME_RED};
  color: ${({ theme }) => theme.core.textColor};

  position: relative;
  z-index: 5;
`
// background-color: ${({ theme }) => theme.core.darkBackground};
// border-bottom: 1px solid ${({ theme }) => theme.core.dividerColor};
// box-shadow: 0 0.125rem 0 ${({ theme }) => theme.core.darkBackground};

export const HeaderNav = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 2rem;
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
