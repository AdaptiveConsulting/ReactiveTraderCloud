import React from 'react'
import { Transition } from 'react-spring'
import { AdaptiveLoader } from 'rt-components'
import { styled } from 'rt-theme'

const TileBookingStyle = styled.div`
  position: absolute;
  left: 0;
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
  altStyle: boolean
  color: string
  isAnalyticView: boolean
}>`
  padding: 0.3rem;
  position: absolute;
  left: ${({ isAnalyticView, altStyle }) =>
    isAnalyticView && !altStyle ? '65%' : isAnalyticView ? '-65%' : ''};
  border-radius: ${({ altStyle }) => (altStyle ? '17px' : '3px')};
  background: ${({ theme, color, disabled }) =>
    theme.template[color][disabled ? 'dark' : 'normal']};
  pointer-events: auto; /* restore the click on this child */
  width: ${({ altStyle, isAnalyticView }) =>
    isAnalyticView && !altStyle ? '82px' : altStyle ? '125px' : '64px'};
  rect {
    fill: ${({ theme }) => theme.template.white.normal};
  }

  ${({ onClick, disabled }) =>
    onClick &&
    !disabled &&
    `
  cursor: pointer;
  `}
`

const BookingStatus = styled.span<{ altStyle: boolean }>`
  color: ${({ theme }) => theme.template.white.normal};
  font-size: ${({ altStyle }) => (altStyle ? '13px' : '11px')};
`

const AdaptiveLoaderWrapper = styled.span`
  padding-right: 0.375rem;
`

interface TileBookingProps {
  show: boolean
  showLoader?: boolean
  disabled?: boolean
  color: string
  onBookingPillClick?: () => void
  isAnalyticView?: boolean
}

const TileBooking: React.FC<TileBookingProps> = ({
  show,
  showLoader,
  disabled,
  color,
  onBookingPillClick,
  children,
  isAnalyticView,
}) => (
  <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
    {show &&
      (styles => (
        <TileBookingStyle style={styles}>
          <BookingPill
            color={color}
            onClick={e => {
              if (!disabled && typeof onBookingPillClick === 'function') {
                onBookingPillClick()
              }
            }}
            altStyle={!!showLoader}
            disabled={!!disabled}
            isAnalyticView={!!isAnalyticView}
            data-qa="tile-booking__booking-pill"
          >
            {showLoader && (
              <AdaptiveLoaderWrapper>
                <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
              </AdaptiveLoaderWrapper>
            )}
            <BookingStatus data-qa="tile-booking__booking-status" altStyle={!!showLoader}>
              {children}
            </BookingStatus>
          </BookingPill>
        </TileBookingStyle>
      ))}
  </Transition>
)

export default TileBooking
