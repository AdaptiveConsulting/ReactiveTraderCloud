import React from 'react'
import { Transition } from 'react-spring'
import { AdaptiveLoader } from 'rt-components'
import { styled } from 'rt-theme'

const TileBookingStyle = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BookingPill = styled.div`
  padding: 0.75rem 0.9375rem;
  border-radius: 17px;
  background: ${({ theme }) => theme.template.blue.normal};

  rect {
    fill: ${({ theme }) => theme.template.white.normal};
  }
`

const BookingStatus = styled.span`
  margin-left: 0.375rem;
  color: ${({ theme }) => theme.template.white.normal};
  font-size: 0.8125rem;
`
interface Props {
  show: boolean
}

const TileBooking: React.FC<Props> = ({ show }) => (
  <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
    {show &&
      (styles => (
        <TileBookingStyle style={styles}>
          <BookingPill>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
            <BookingStatus>Executing</BookingStatus>
          </BookingPill>
        </TileBookingStyle>
      ))}
  </Transition>
)

export default TileBooking
