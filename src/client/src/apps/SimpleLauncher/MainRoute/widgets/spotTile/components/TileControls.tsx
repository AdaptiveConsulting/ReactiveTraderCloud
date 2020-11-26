import React, { useCallback } from 'react'
import { PopoutIcon, PopInIcon } from 'rt-components'
import styled from 'styled-components/macro'
import { usePlatform, platformHasFeature } from 'rt-platforms'
import { CurrencyPair } from 'rt-types'
import { setNotionalOnStorage } from 'rt-util'

export const TopRightButton = styled('button')`
  position: absolute;
  right: 1rem;
  top: 0.995rem;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: (x: number, y: number) => void
  currencyPair: CurrencyPair
  notional?: number | undefined
}

const TileControls: React.FC<Props> = ({ onPopoutClick, canPopout, currencyPair, notional }) => {
  const platform = usePlatform()

  const popoutClickHandler = useCallback(
    event => {
      if (typeof notional !== 'undefined') {
        setNotionalOnStorage(currencyPair.symbol, notional)
      }
      onPopoutClick && onPopoutClick(event.screenX, event.screenY)
    },
    [currencyPair.symbol, notional, onPopoutClick]
  )

  const popinClickHandler = () => {
    if (typeof notional !== 'undefined') {
      setNotionalOnStorage(currencyPair.symbol, notional)
    }
    platform.window.close()
  }

  return (
    <React.Fragment>
      {canPopout ? (
        <TopRightButton onClick={popoutClickHandler} data-qa="tile-controls__popout-button">
          {PopoutIcon}
        </TopRightButton>
      ) : platformHasFeature(platform, 'allowPopIn') ? (
        <TopRightButton onClick={popinClickHandler} data-qa="tile-controls__popin-button">
          {PopInIcon}
        </TopRightButton>
      ) : null}
    </React.Fragment>
  )
}
export default TileControls
