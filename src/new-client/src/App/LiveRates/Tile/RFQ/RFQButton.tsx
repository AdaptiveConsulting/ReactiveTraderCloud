import React from "react"
import styled from "styled-components/macro"
import { map, distinctUntilChanged } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { useTileCurrencyPair } from "../Tile.context"
import { getNotional$ } from "../Tile.state"
import { OverlayDiv } from "components/OverlayDiv"
import { CenteringContainer } from "components/CenteringContainer"

const RFQButtonInner = styled("button")`
  background-color: ${({ theme }) => theme.accents.primary.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  width: 64px;
  height: 48px;
  border-radius: 3px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
`

const [useIsRFQ] = bind(
  (symbol: string) =>
    getNotional$(symbol).pipe(
      map((newNotional) => parseFloat(newNotional) >= 10_000_000),
    ),
  false,
)

export const RFQButton: React.FC = () => {
  const { symbol } = useTileCurrencyPair()
  const isRFQ = useIsRFQ(symbol)
  return isRFQ ? (
    <OverlayDiv>
      <CenteringContainer>
        <RFQButtonInner>Initiate RFQ</RFQButtonInner>
      </CenteringContainer>
    </OverlayDiv>
  ) : null
}

// display: flex;
// justify-content: center;
// padding-left: 9px;
// padding-right: 10px;
// padding-bottom: ${({ isExecutingStatus, isAnalyticsView }) =>
//   isAnalyticsView && !isExecutingStatus ? '7px' : isExecutingStatus ? '10px' : '8px'};
// padding-top: ${({ isExecutingStatus, isAnalyticsView }) =>
//   isAnalyticsView && !isExecutingStatus ? '6px' : isExecutingStatus ? '10px' : '8px'};
// position: absolute;
// ${({ isAnalyticsView, isExecutingStatus }) =>
//   isAnalyticsView && !isExecutingStatus && 'right: 1.35rem'};
// top: ${({ isAnalyticsView, isExecutingStatus }) =>
//   isAnalyticsView && !isExecutingStatus ? '2.8rem' : isAnalyticsView ? '2.3rem' : ''};
// border-radius: ${({ isExecutingStatus }) => (isExecutingStatus ? '17px' : '3px')};
// background: ${({ theme, color, disabled }) => theme.accents[color][disabled ? 'darker' : 'base']};
// pointer-events: auto; /* restore the click on this child */
// width: ${({ isExecutingStatus, isAnalyticsView }) =>
//   isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '58px'};
// rect {
//   fill: ${({ theme }) => theme.white};
// }

// ${({ onClick, disabled }) =>
//   onClick &&
//   !disabled &&
//   `
// cursor: pointer;
// `}
// @media (min-width: 321px) {
//   width: ${({ isExecutingStatus, isAnalyticsView }) =>
//     isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '60px'};
// }
// @media (min-width: 401px) {
//   width: ${({ isExecutingStatus, isAnalyticsView }) =>
//     isAnalyticsView && !isExecutingStatus ? '82px' : isExecutingStatus ? '125px' : '64px'};
// }
