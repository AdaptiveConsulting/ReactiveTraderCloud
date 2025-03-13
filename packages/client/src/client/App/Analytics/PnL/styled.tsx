import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { Line } from "@/client/components/Line"

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export const BarContainer = styled(FlexBox)`
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.64);
    transform-origin: ${({ distance }) =>
        distance > 35 ? "calc(164% - 15px)" : "center"}
      12px;
  }
`
const barLength = 180
const indicatorWidth = 5

export const PriceIndicator = styled.div<{
  distance: number
}>`
  height: 100%;
  width: ${indicatorWidth}px;

  transition: transform 0.5s;
  transform: translate(
    ${({ distance }) => {
      const translationToCenterOfBar = barLength / 2 - indicatorWidth / 2
      const translationDistanceAlongBar =
        distance === -Infinity ? 0 : (barLength / 100) * distance
      return `calc(${translationToCenterOfBar}px + ${translationDistanceAlongBar}px)`
    }}
  );

  background-color: ${({ theme }) => theme.color["Colors/Border/border-buy"]};
`

export const BarPriceContainer = styled.div`
  width: ${barLength}px;
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
  left: ${barLength / 2 - 1}px;
`
