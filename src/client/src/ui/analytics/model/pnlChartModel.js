import { PricePoint } from './';
import { HistoricPosition } from '../../../services/model';
import numeral from 'numeral';

export default class PnlChartModel  {
  options:Object;
  lastPos:string;
  minPnl:number;
  maxPnl:number;
  _seriesData:Array<PricePoint>;

  constructor() {
    this._seriesData = [];
    this.options = {
      xAxis: {
        tickFormat: (d) => d3.time.format('%X')(new Date(d))
      },
      yAxis: {
        tickFormat: (d) => numeral(d).format('0a')
      },
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: {
        left: 30,
        top: 10,
        right: 0,
        bottom: 24
      }
    };
  }

  get hasData() : Boolean {
    return this._seriesData.length > 0;
  }

  getSeries() {
    return [{
      series: 'PNL',
      label: 'PNL',
      area: true,
      color: 'slategray',
      values: this._seriesData
    }];
  }

  update(positions):Array<HistoricPosition> {
    let { lastPos, minPnl, maxPnl, series } = this._processUpdate(positions);
    this.lastPos = lastPos;
    this.minPnl = minPnl;
    this.maxPnl = maxPnl;
    this._seriesData = series;
  }

  _processUpdate(positions:Array<HistoricPosition> = []):{ lastPos:string, domainMin:number,domainMax:number, series:Array<PricePoint>  } {
    let lastPos:string,
      minPnl:number = 0,
      maxPnl:number = 0;
    let series:Array<PricePoint> = _(positions)
      .filter((item:HistoricPosition) => item && item.usdPnl != null)
      .map((item:HistoricPosition) => {
        lastPos = item.usdPnl.toFixed(2);
        minPnl = Math.min(minPnl, item.usdPnl);
        maxPnl = Math.max(maxPnl, item.usdPnl);
        return new PricePoint(new Date(item.timestamp), item.usdPnl.toFixed(2));
      }).value();
    return {
      lastPos,
      minPnl,
      maxPnl,
      series
    };
  }
}
