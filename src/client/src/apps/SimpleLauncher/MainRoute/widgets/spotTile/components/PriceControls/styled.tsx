import styled from 'styled-components/macro'

export const PriceControlsStyle = styled('div')<{
  isAnalyticsView: boolean
  isTradeExecutionInFlight?: boolean
}>`
  display: flex;
  justify-content: space-between;
  ${({ isAnalyticsView }) => (isAnalyticsView ? `` : `align-items: center; margin-top: 15px;`)}
  ${({ isTradeExecutionInFlight }) => !isTradeExecutionInFlight && 'position: relative'}
`

export const PriceButtonDisabledPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  font-size: 10px;
  transition: background-color 0.2s ease;
  height: 58px;
  min-height: 2rem;
  max-height: 3.7rem;
  margin-bottom: 1px;
  min-width: 125px;
  line-height: normal;
  opacity: 0.5;
  text-align: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.primary[5]};
  font-weight: 400;
`

export const Icon = styled.i`
  font-size: 20px;
  margin: 3px 0;
`

export const AdaptiveLoaderWrapper = styled.div`
  margin: 0 3px;
`
