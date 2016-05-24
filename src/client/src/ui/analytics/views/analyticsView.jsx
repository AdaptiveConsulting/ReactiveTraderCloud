import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { router, logger } from '../../../system';
import { ViewBase } from '../../common';
import { AnalyticsModel, PositionsChartModel, PnlChartModel } from '../model';
import { ChartGradient } from './';
import NVD3Chart from 'react-nvd3';
import AnalyticsBarChart from './analyticsBarChart';
import numeral from 'numeral';
import Dimensions from 'react-dimensions';
import './analytics.scss';

var _log:logger.Logger = logger.create('AnalyticsView');

@Dimensions()
export default class AnalyticsView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  componentDidUpdate() {
    if (this.refs.pnlChart) {
      if (!this.chartGradient) {
        this.chartGradient = new ChartGradient();
      }
      var chartDomElement = ReactDOM.findDOMNode(this.refs.pnlChart);
      if (chartDomElement) {
        var pnlChartModel = this.state.model.pnlChartModel;
        this.chartGradient.update(chartDomElement, pnlChartModel.minPnl, pnlChartModel.maxPnl);
      }
    }
  }

  render() {
    let model:AnalyticsModel = this.state.model;
    if (!model) {
      return null;
    }
    if (!model.isAnalyticsServiceConnected)
      return (
        <div className='analytics__container'>
          <div ref='analyticsInnerContainer'></div>
        </div>);

    let pnlComponents = this._createPnlComponents();
    let positionsComponents = this._createPositionsComponents();

    let newWindowBtnClassName = classnames(
      'glyphicon glyphicon-new-window',
      {
        'analytics__icon--tearoff' : !model.canPopout(),
        'analytics__icon--tearoff--hidden' : model.canPopout()
      }
    );

    return (
      <div className='analytics analytics__container animated fadeIn'>
        <div className='analytics__controls popout__controls'>
          <i className={newWindowBtnClassName}
             onClick={() => router.publishEvent(this.props.modelId, 'popOutAnalytics', {})}/>
        </div>
        {pnlComponents}
        {positionsComponents}
      </div>);
  }

  _createPnlComponents() {
    let pnlChartModel:PnlChartModel = this.state.model.pnlChartModel;
    let pnlChart = null;
    let className = classnames('analytics__chart-container', {'negative': pnlChartModel.lastPos > 0});
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
          <span className='analytics__header--bold analytics__header-block'>Profit & Loss</span>
          <span>USD </span><span className='analytics__header--bold'>{formattedLastPos}</span>
        </div>
        <div className={className}>
          {pnlChart}
        </div>
      </div>
    );
  }
  
  _createPositionsComponents() {

    let positionsChartModel:PositionsChartModel = this.state.model.positionsChartModel;
    let isPnL = positionsChartModel.basePnlDisplayModelSelected;
    let baseClassName = 'btn analytics__buttons-tab-btn ';
    let selectedClassName = `${baseClassName} analytics__buttons-tab-btn--selected`;
    let pnlButtonClassName = isPnL ? selectedClassName : baseClassName;
    let positionButtonClassName = isPnL ? baseClassName : selectedClassName;

    return (
      <div>
        <div className='analytics__buttons'>
          <div className='analytics__buttons-bar'>
            <button
              className={pnlButtonClassName}
              onClick={() => router.publishEvent(this.props.modelId, 'togglePnlDisplayMode', {})}>PnL
            </button>
            <button
              className={positionButtonClassName}
              onClick={() => router.publishEvent(this.props.modelId, 'togglePnlDisplayMode', {})}>Positions
            </button>
          </div>
        </div>
        <div className='analytics__chart-container'>
          <AnalyticsBarChart series={positionsChartModel.seriesData} isPnL={positionsChartModel.basePnlDisplayModelSelected}/>
        </div>
      </div>
    );
  }
}
