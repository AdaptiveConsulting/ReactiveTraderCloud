import React from 'react';
import classnames from 'classnames';
import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import { Message } from '../../common/components';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import { Direction, PriceMovementType } from '../../../services/model';

import './spotTileView.scss';

var _log:logger.Logger = logger.create('SpotTileView');

class SpotTileView extends ViewBase {

  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model = this.state.model;
    if (!model || !model.currentSpotPrice) {
      return null;
    }
    let sparklineChart = this._createSparkLineChart();
    let actionsClass = classnames('currency-pair-actions', {'hide': model.hasTradeExecutionNotification});
    let sizerClass = classnames('sizer', {'hide': model.hasTradeExecutionNotification});
    let tradeExecutionNotificationView = model.hasTradeExecutionNotification
      ? this._createTradeNotification()
      : null;
    return (
      <div>
        <div className='currency-pair-title'>
          <i className='glyphicon glyphicon-stats pull-right'
             onClick={() => router.publishEvent(this.props.modelId, 'toggleSparkLineChart', {})}/>
          <span>{model.tileTitle}</span>
          <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {tradeExecutionNotificationView}
        <div className={actionsClass}>
          <PriceButton
            direction={Direction.Sell}
            onExecute={() => router.publishEvent(this.props.modelId, 'executeTrade', { direction:Direction.Sell })}
            rate={model.currentSpotPrice.bid}
          />
          <PriceMovementIndicator
            priceMovementType={model.currentSpotPrice.priceMovementType}
            spread={model.currentSpotPrice.spread}
          />
          <PriceButton
            direction={Direction.Buy}
            onExecute={() => router.publishEvent(this.props.modelId, 'executeTrade', { direction:Direction.Sell })}
            rate={model.currentSpotPrice.ask}
          />
        </div>
        <div className='clearfix'></div>
        <NotionalInput
          className={sizerClass}
          notional={model.notional}
          onChange={(notional) => router.publishEvent(this.props.modelId, 'notionalChanged', { notional:notional })}
          currencyPair={model.currencyPair}
        />
        <div className='clearfix'></div>
        {sparklineChart}
      </div>
    );
  }

  _createSparkLineChart() {
    let model = this.state.model;
    if (model.shouldShowChart) {
      return (
        <Sparklines
          data={model.historicMidSportRates.slice()}
          width={326}
          height={22}
          margin={0}>
          <SparklinesLine />
          <SparklinesSpots />
          <SparklinesReferenceLine type='avg'/>
        </Sparklines>)
    } else {
      return <div className='sparkline-holder'></div>;
    }
  }

  _createTradeNotification() {
    return (
      <TradeNotification
        tradeExecutionNotification={this.state.model.tradeExecutionNotification}
        onDismissedClicked={(e) => router.publishEvent(this.props.modelId, 'tradeNotificationDismissed', {})}
      />
    );
  }
}

export default SpotTileView;
