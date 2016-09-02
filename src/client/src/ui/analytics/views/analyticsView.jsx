import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { logger } from '../../../system';
import { PositionsChartModel, PnlChartModel } from '../model';
import { ChartGradient } from './';
import NVD3Chart from 'react-nvd3';
import AnalyticsBarChart from './chart/analyticsBarChart';
import numeral from 'numeral';
import Dimensions from 'react-dimensions';
import PositionsBubbleChart from './positions-chart/positionsBubbleChart';
import './analytics.scss';

var _log:logger.Logger = logger.create('AnalyticsView');

@Dimensions()
export default class AnalyticsView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  componentDidMount(){
    this.updateGradient();
  }

  componentDidUpdate() {
    this.updateGradient();
  }

  updateGradient(){
    if (this.refs.pnlChart) {
      if (!this.chartGradient) {
        this.chartGradient = new ChartGradient();
      }
      var chartDomElement = ReactDOM.findDOMNode(this.refs.pnlChart);
      if (chartDomElement) {
        var pnlChartModel = this.props.model.pnlChartModel;
        this.chartGradient.update(chartDomElement, pnlChartModel.minPnl, pnlChartModel.maxPnl);
      }
    }
  }

  render() {
    let model = this.props.model;
    let router = this.props.router;
    if (!model.isAnalyticsServiceConnected)
      return (
        <div className='analytics__container'>
          <div ref='analyticsInnerContainer'></div>
        </div>);

    let pnlComponents = this._createPnlComponents();
    let pnlSliders = this._createPnlSliders();
    let positionsBubbleChart = this._createPositionsChart();

    let newWindowBtnClassName = classnames(
      'glyphicon glyphicon-new-window',
      {
        'analytics__icon--tearoff' : !model.canPopout,
        'analytics__icon--tearoff--hidden' : model.canPopout
      }
    );

    return (
      <div className='analytics analytics__container animated fadeIn'>
        <div className='analytics__controls popout__controls'>
          <i className={newWindowBtnClassName}
             onClick={() => router.publishEvent(this.props.model.modelId, 'popOutAnalytics', {})}/>
        </div>
        {pnlComponents}
        {positionsBubbleChart}
        {pnlSliders}
      </div>);
  }

  _createPnlComponents() {
    let pnlChartModel:PnlChartModel = this.props.model.pnlChartModel;
    let pnlChart = null;
    let analyticsHeaderClassName = classnames('analytics__header-value', {
      'analytics__header-value--negative': pnlChartModel.lastPos < 0,
      'analytics__header-value--positive': pnlChartModel.lastPos > 0
    });
    let formattedLastPos = numeral(pnlChartModel.lastPos).format();
    if (pnlChartModel.hasData) {
      let configurePnLChart = (chart) => {
        let pnlTooltip = d => {
          let { value, series } = d,
            formatted = numeral(series[0].value).format('0.0a');
          return `<p><strong>${value}:</strong> ${formatted}</p>`;
        };
        chart.yDomain([pnlChartModel.minPnl, pnlChartModel.maxPnl]).yRange([150, 0]);
        chart.interactiveLayer.tooltip.contentGenerator(pnlTooltip);
      };
      pnlChart = (
        <NVD3Chart
          ref='pnlChart'
          type='lineChart'
          datum={pnlChartModel.getSeries()}
          options={pnlChartModel.options}
          height={180}
          configure={configurePnLChart}/>
      );
    } else {
      pnlChart = (<div>No PNL data yet</div>);
    }
    return (
      <div>
        <div className='analytics__header'>
          <span className='analytics__header-title'>
            <i className='analytics__header-title-icon glyphicon glyphicon-stats'></i>
            Profit & Loss
          </span>
          <span className={analyticsHeaderClassName}>USD {formattedLastPos}</span>
        </div>
        <div className='analytics__chart-container'>
          {pnlChart}
        </div>
      </div>
    );
  }

  _createPositionsChart(){
    let model = this.props.model;
    let positionsChartData = model.positionsChartModel.seriesData;

    return (
        <div className='analytics__bubblechart-container'>
          <span className='analytics__chart-title analytics__bubblechart-title'>Positions</span>
          <PositionsBubbleChart data={positionsChartData}/>
        </div>
      );
  }

  _createPnlSliders() {
    let positionsChartModel:PositionsChartModel = this.props.model.positionsChartModel;
    return (
      <div>
        <div className='analytics__chart-container'>
          <span className='analytics__chart-title'>PnL</span>
          <AnalyticsBarChart series={positionsChartModel.seriesData}/>
        </div>
      </div>
    );
  }
}
