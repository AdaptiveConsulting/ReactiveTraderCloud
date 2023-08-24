import styled from "styled-components"

export const SellSideWrapper = styled.div`
  z-index: 1;
  min-height: 220px;
  max-height: 220px;
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  border: 1px solid ${({ theme }) => theme.core.dividerColor};
`

export const NoSelectedWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 8px 12px 8px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.core.textColor};
`

export const NoSelectHeader = styled.div`
  padding: 8px 0;
  font-size: 11px;
  flex: 0 1 auto;
  background-color: ${({ theme }) => theme.core.darkBackground};
`

export const NoSelectedMessage = styled.div`
  width: 100%;
  flex: 1 1 auto;
  text-align: center;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 1px solid ${({ theme }) => theme.core.dividerColor};
  color: ${({ theme }) => theme.core.textColor};
`
