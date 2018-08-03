import React, { Component } from 'react'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import SpotTile from './_SpotTile'
import TileBooking from './TileBooking'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction) => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade } = this.props
    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        {this.renderStates()}
      </SpotTile>
    )
  }

  private renderStates = () => {
    const { spotTileData } = this.props
    if (spotTileData.isTradeExecutionInFlight) {
      return <TileBooking />
    }
    if (spotTileData.notification) {
      console.log(spotTileData.notification)
    }
    return <div />
  }
}
