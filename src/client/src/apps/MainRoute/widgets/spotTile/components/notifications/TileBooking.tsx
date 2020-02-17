import React from 'react'
import { Transition } from 'react-spring'
import { AdaptiveLoader } from 'rt-components'
import { styled } from 'rt-theme'

const TileBookingStyle = styled.div<{ isAnalyticsView: boolean }>`
  position: absolute;
  left: 0;
  ${({ isAnalyticsView }) => isAnalyticsView && 'top: 0'}
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* allow clicks to go through div */
  text-align: center;
  z-index: 2;
`

const BookingPill = styled.div<{
  disabled: boolean
  isExecutingStatus: boolean
  color: string
  isAnalyticsView: boolean
}>`
  display: flex;
  justify-content: center;
  padding-left: 9px;
  padding-right: 10px;
  padding-bottom: ${({ isExecutingStatus, isAnalyticsView }) =>
    isAnalyticsView && !isExecutingStatus ? '7px' : isExecutingStatus ? '10px' : '8px'};
  padding-top: ${({ isExecutingStatus, isAnalyticsView }) =>
    isAnalyticsView && !isExecutingStatus ? '6px' : isExecutingStatus ? '10px' : '8px'};
  position: absolute;
  ${({ isAnalyticsView, isExecutingStatus }) =>
    isAnalyticsView && !isExecutingStatus && 'right: 1.35rem'};
  border-radius: ${({ isExecutingStatus }) => (isExecutingStatus ? '17px' : '3px')};
  background: ${({ theme, color, disabled }) =>
    theme.template[color][disabled ? 'dark' : 'normal']};
  pointer-events: auto; /* restore the click on this child */
  width: ${({ isExecutingStatus, isAnalyticsView }) =>
    isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '58px'};
  rect {
    fill: ${({ theme }) => theme.template.white.normal};
  }

  ${({ onClick, disabled }) =>
    onClick &&
    !disabled &&
    `
  cursor: pointer;
  `}
  @media (min-width: 321px) {
    width: ${({ isExecutingStatus, isAnalyticsView }) =>
      isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '60px'};
  }
  @media (min-width: 401px) {
    width: ${({ isExecutingStatus, isAnalyticsView }) =>
      isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '64px'};
  }
`

const BookingStatus = styled.span<{ isExecutingStatus: boolean }>`
  color: ${({ theme }) => theme.template.white.normal};
  font-size: ${({ isExecutingStatus }) => (isExecutingStatus ? '0.8125rem' : '0.6875rem')};
`

const AdaptiveLoaderWrapper = styled.span`
  padding-right: 0.375rem;
  padding-top: 0.04rem;
`

interface TileBookingProps {
  show: boolean
  showLoader: boolean
  disabled?: boolean
  color: string
  onBookingPillClick?: () => void
  isAnalyticsView: boolean
}

const TileBooking: React.FC<TileBookingProps> = ({
  show,
  showLoader,
  disabled,
  color,
  onBookingPillClick,
  children,
  isAnalyticsView,
}) => (
  <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
    {show &&
      (styles => (
        <TileBookingStyle isAnalyticsView={isAnalyticsView} style={styles}>
          <BookingPill
            color={color}
            onClick={e => {
              if (!disabled && typeof onBookingPillClick === 'function') {
                onBookingPillClick()
              }
            }}
            isExecutingStatus={showLoader}
            disabled={!!disabled}
            isAnalyticsView={isAnalyticsView}
            data-qa="tile-booking__booking-pill"
          >
            {showLoader && (
              <AdaptiveLoaderWrapper>
                <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
              </AdaptiveLoaderWrapper>
            )}
            <BookingStatus data-qa="tile-booking__booking-status" isExecutingStatus={showLoader}>
              {children}
            </BookingStatus>
          </BookingPill>
        </TileBookingStyle>
      ))}
  </Transition>
)

export default TileBooking
