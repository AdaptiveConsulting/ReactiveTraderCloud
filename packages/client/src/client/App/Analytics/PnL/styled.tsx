import styled from "styled-components"

import { Line } from "@/client/components/Line"

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export const PriceContainer = styled(FlexDiv).attrs(
  (props: { distance: number }) => ({
    style: {
      transform: `translate(${props.distance}%)`,
    },
  }),
)<{ distance: number }>`
  width: 100%;
  transition: transform 0.5s;
  transition-timing-function: ${({ theme }) => theme.motion.easing};
`

export const PriceLabel = styled.div<{
  distance: number
}>`
  align-self: center;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  &:hover {
    transform: scale(1.64);
    transform-origin: ${({ distance }) =>
        distance > 35 ? "calc(164% - 15px)" : "center"}
      12px;
  }
`

export const PriceIndicatorContainer = styled.div.attrs<{
  distance: number
}>(({ distance }) => {
  return {
    style: {
      transform: `translate(${distance}%)`,
      transition: "transform 0.5s",
    },
  }
})<{ distance: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const indicatorWidth = 5

export const PriceIndicator = styled.div`
  height: 100%;
  width: ${indicatorWidth}px;
  background-color: ${({ theme }) => theme.color["Colors/Border/border-buy"]};
  z-index: 1;
`

export const BarPriceContainer = styled.div`
  width: 100%;
`

export const Bar = styled.div`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
  height: ${indicatorWidth}px;
`

export const CenterLine = styled(Line)`
  position: absolute;
  left: 50%;
`
