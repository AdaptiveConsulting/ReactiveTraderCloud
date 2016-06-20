import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { router, logger } from '../../../system';
import { ViewBase } from '../../common';
import { AnalyticsModel, PositionsChartModel, PnlChartModel } from '../model';
import { ChartGradient } from './';
import NVD3Chart from 'react-nvd3';
import AnalyticsBarChart from './chart/analyticsBarChart';
import numeral from 'numeral';
import Dimensions from 'react-dimensions';
import PositionsBubbleChart from './positions-chart/positionsBubbleChart';
import './analytics.scss';
import './themes/theme-a.scss';

var _log:logger.Logger = logger.create('AnalyticsView');

@Dimensions()
export default class AnalyticsView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
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
        var pnlChartModel = this.state.model.pnlChartModel;
        this.chartGradient.update(chartDomElement, pnlChartModel.minPnl, pnlChartModel.maxPnl);
      }
    }
  }

  render() {
    let model:AnalyticsModel = this.state.model;
    let positionsCharData = model.positionsChartModel.seriesData;

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
        'analytics__icon--tearoff' : !model.canPopout,
        'analytics__icon--tearoff--hidden' : model.canPopout
      }
    );

    return (
      <div className='analytics analytics__container animated fadeIn'>
        <div className='analytics__controls popout__controls'>
          <i className={newWindowBtnClassName}
             onClick={() => router.publishEvent(this.props.modelId, 'popOutAnalytics', {})}/>
        </div>
        {pnlComponents}
        <PositionsBubbleChart data={positionsCharData}/>
        {positionsComponents}
      </div>);
  }

  _createPnlComponents() {
    let pnlChartModel:PnlChartModel = this.state.model.pnlChartModel;
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
          <span className='analytics__header-title'><i className='analytics__header-title-icon glyphicon glyphicon-stats'></i>Profit & Loss</span>
          <span className={analyticsHeaderClassName}>USD {formattedLastPos}</span>
        </div>
        <div className='analytics__chart-container'>
          {pnlChart}
        </div>
      </div>
    );
  }

  _createPositionsComponents() {
    //console.log(' ****  this.state.model : ',  this.state.model);
    let positionsChartModel:PositionsChartModel = this.state.model.positionsChartModel;
    return (
      <div>
        <div className='analytics__chart-container'>
          <AnalyticsBarChart series={positionsChartModel.seriesData}/>
        </div>
      </div>
    );
  }
}
