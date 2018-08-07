import React from 'react'
import { Flex, LogoIcon } from 'rt-components'
import { styled } from 'rt-util'

const TileBookingStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const BookingPill = styled(Flex)`
  background-color: ${({ theme: { palette } }) => palette.accentPrimary.normal};
  padding: 10px 16px;
  border-radius: 17px;

  box-shadow: 0 0 30px ${({ theme: { palette } }) => palette.accentPrimary.normal},
    0 0 10px ${({ theme: { palette } }) => palette.accentPrimary.dark};

  .svg-icon {
    padding-right: 10px;
    fill: ${({ theme: { text } }) => text.white};
  }
`

const BookingStatus = styled('span')`
  margin-left: 6px;
  color: ${({ theme: { text } }) => text.white};
  font-size: 13px;
`

const TileBooking = () => (
  <TileBookingStyle>
    <BookingPill>
      <LogoIcon />
      <BookingStatus>Executing</BookingStatus>
    </BookingPill>
  </TileBookingStyle>
)

export default TileBooking
