import styled from 'styled-components'

export const PriceControlsStyle = styled('div')<{ isAnalyticsView: boolean }>`
  display: flex;
  justify-content: space-between;
  ${({ isAnalyticsView }) =>
    isAnalyticsView ? `width: 50%;` : `align-items: center; margin-top: 15px;`}
  position: relative;
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
  height: 59px;
  width: 122px;
  min-width: 122px;
  min-height: 59px;
  line-height: normal;
  opacity: 0.5;
  text-align: center;
  text-transform: uppercase;
`

export const Icon = styled.i`
  font-size: 20px;
  margin: 3px 0;
`

export const AdaptiveLoaderWrapper = styled.div`
  margin: -5px 0 3px;
`
