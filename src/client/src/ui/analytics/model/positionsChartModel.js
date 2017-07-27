import { observeEvent } from 'esp-js';
import {  CurrencyPairPosition } from '../../../services/model';

import logger from '../../../system/logger';
var _log = logger.create('PositionsChartModel');

export default class PositionsChartModel {
  options;
  _seriesData;

  yAxisValuePropertyName;

  constructor() {
    this._seriesData = [];
    this.options = {
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 250,
      showValues: true,
      showControls: false,
      tooltip: {
        enabled: false
      },
      margin: {
        top: 0,
        right: 0,
        bottom: 0
      }
    };
    this.yAxisValuePropertyName = CurrencyPairPosition.baseTradedAmountName;
  }

  get hasData() {
    return this._seriesData.length > 0;
  }

  get seriesData() {
    return this._seriesData;
  }

  get itemCount() {
    return this._seriesData.length;
  }

  get basePnlDisplayModelSelected() {
    return this.yAxisValuePropertyName === CurrencyPairPosition.basePnlName;
  }

  getSeries() {
    return [{
      name: 'Pos/PnL',
      values: this._seriesData,
      color: 'slategray'
    }];
  }

  update(positions) {
    this._seriesData = positions;
  }

  @observeEvent('togglePnlDisplayMode')
  _togglePnlDisplayMode() {
    _log.info(`Changing pnl chart display mode`);
    this.yAxisValuePropertyName = this.yAxisValuePropertyName === CurrencyPairPosition.basePnlName
      ? CurrencyPairPosition.baseTradedAmountName
      : CurrencyPairPosition.basePnlName;
  }
}
