import { observeEvent } from 'esp-js/src';
import { Guard } from '../../../system';
import { PricePoint } from './';
import {  CurrencyPairPosition } from '../../../services/model';
import { logger } from '../../../system';

var _log:logger.Logger = logger.create('PositionsChartModel');

export default class PositionsChartModel {
  options:Object;
  _seriesData:Array<CurrencyPairPosition>;

  yAxisValuePropertyName:string;

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

  get hasData() : Boolean {
    return this._seriesData.length > 0;
  }

  get itemCount() : Number {
    return this._seriesData.length;
  }

  get basePnlDisplayModelSelected() {
    return this.yAxisValuePropertyName === CurrencyPairPosition.basePnl;
  }

  getSeries() {
    return [{
      name: 'Pos/PnL',
      values: this._seriesData,
      color: 'slategray'
    }];
  }

  update(positions:Array<CurrencyPairPosition>) {
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
