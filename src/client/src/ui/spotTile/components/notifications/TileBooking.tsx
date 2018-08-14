import React from 'react'
import { Transition } from 'react-spring'
import { Flex, LogoIcon } from 'rt-components'
import { styled } from 'rt-util'

const TileBookingStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BookingPill = styled(Flex)`
  background-color: ${({ theme: { palette } }) => palette.accentPrimary.normal};
  padding: 0.625rem 0.875rem;
  border-radius: 17px;

  box-shadow: 0 0 30px ${({ theme: { palette } }) => palette.accentPrimary.normal},
    0 0 0.625rem ${({ theme: { palette } }) => palette.accentPrimary.dark};

  .svg-icon {
    padding-right: 0.625rem;
    fill: ${({ theme: { text } }) => text.white};
  }
`

const BookingStatus = styled('span')`
  margin-left: 0.375rem;
  color: ${({ theme: { text } }) => text.white};
  font-size: 0.8125rem;
`
interface Props {
  show: boolean
}

const TileBooking: React.SFC<Props> = ({ show }) => (
  <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
    {show &&
      (styles => (
        <TileBookingStyle style={styles}>
          <BookingPill>
            <LogoIcon />
            <BookingStatus>Executing</BookingStatus>
          </BookingPill>
        </TileBookingStyle>
      ))}
  </Transition>
)

export default TileBooking
