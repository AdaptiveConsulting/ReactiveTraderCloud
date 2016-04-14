import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { router, logger } from '../../../system';
import { ViewBase } from '../../common';
import { AnalyticsModel, PositionsChartModel, PnlChartModel } from '../model';
import { ChartGradient } from './';
import NVD3Chart from 'react-nvd3';
import numeral from 'numeral';
import './analytics.scss';

var _log:logger.Logger = logger.create('AnalyticsView');

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
      return <span />;

    let pnlComponents = this._createPnlComponents();
    let positionsComponents = this._createPositionsComponents();
    return (
      <div className='analytics analytics-container animated fadeIn'>
        <div className='analytics__controls popout__controls'>
          <i className='glyphicon glyphicon-new-window'
             onClick={() => router.publishEvent(this.props.modelId, 'popOutAnalytics', {})}/>
        </div>
        {pnlComponents}
        {positionsComponents}
      </div>);
  }

  _createPnlComponents() {
    let pnlChartModel:PnlChartModel = this.state.model.pnlChartModel;
    let pnlChart = null;
    let className = classnames('nv-container', {'negative': pnlChartModel.lastPos > 0});
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
          height={170}
          configure={configurePnLChart}/>
      );
    } else {
      pnlChart = (<div>No PNL data yet</div>);
    }
    return (
      <div>
        <span className='header'>Profit & Loss&nbsp;
          <small className='text-small'>USD {pnlChartModel.lastPos}</small>
        </span>
        <div className={className}>
          {pnlChart}
        </div>
      </div>
    );
  }

  _createPositionsComponents() {
    let positionsChartModel:PositionsChartModel = this.state.model.positionsChartModel;
    let pnlHeight = Math.min(positionsChartModel.itemCount * 30, 200);
    let configurePositionsChart = (chart) => {
      chart.tooltip.enabled(false);
    };
    let sharedClassNames = ['pull-right', 'btn', 'btn-small', 'btn-default'];
    let pnlButtonClassName = classnames(
      sharedClassNames,
      {
        'selected': positionsChartModel.basePnlDisplayModelSelected
      }
    );
    let positionButtonClassName = classnames(
      sharedClassNames,
      {
        'selected': !positionsChartModel.basePnlDisplayModelSelected
      }
    );
    return (
      <div>
        <span className='header'>Positions / PNL</span>
        <div className='buttons'>
          <button
            className={pnlButtonClassName}
            onClick={() => router.publishEvent(this.props.modelId, 'togglePnlDisplayMode', {})}>PnL
          </button>
          <button
            className={positionButtonClassName}
            onClick={() => router.publishEvent(this.props.modelId, 'togglePnlDisplayMode', {})}>Positions
          </button>
        </div>
        <div className='nv-container clearfix pnlchart'>
          <NVD3Chart
            type='multiBarHorizontalChart'
            datum={positionsChartModel.getSeries()}
            options={positionsChartModel.options}
            height={pnlHeight}
            x='symbol'
            y={positionsChartModel.yAxisValuePropertyName}
            configure={configurePositionsChart}
          />
        </div>
      </div>
    );
  }
}
