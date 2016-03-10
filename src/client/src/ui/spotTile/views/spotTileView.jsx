import React from 'react';
import classnames from 'classnames';
import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import { ViewBase } from '../../common';
import { router } from '../../../system';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import { SpotTileModel, NotificationType } from '../model';
import { Direction } from '../../../services/model';

// TODO : fix below import:
// Styles in the below import extend some font awesome styles, however if we use webpack here then the fontawesome styles are not currently available due to some load ordering issue.
// The below method is the correct approach, however we're going to have to park it for now. The styles in general are rathermessyy and need to be cleaned up.
// import './spotTileView.scss';

export default class SpotTileView extends ViewBase {

  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:SpotTileModel = this.state.model;
    if(model === null) {
      return null;
    }
    let sparklineChart = this._createSparkLineChart();
    let notionalInputClass = classnames('sizer', {'hide': model.hasNotification});
    let notification = this._tryCreateNotification();
    let priceComponents = this._createPriceComponents();
    const className = classnames(
      'currency-pair',
      'animated',
      'flipInX',
      {
        'stale' : !model.pricingConnected || !model.executionConnected,
        'executing' : model.isTradeExecutionInFlight
      }
    );
    return (
      <div className={className}>
        <div className='currency-pair-title'>
          <i className='tearoff-trigger glyphicon glyphicon-new-window pull-right'
             onClick={() => router.publishEvent(this.props.modelId, 'popOutTile', {})}/>
          <i className='glyphicon glyphicon-stats pull-right'
             onClick={() => router.publishEvent(this.props.modelId, 'toggleSparkLineChart', {})}/>
          <span>{model.tileTitle}</span>
          <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {notification}
        {priceComponents}
        <div className='clearfix'></div>
        <NotionalInput
          className={notionalInputClass}
          notional={model.notional}
          onChange={(notional) => router.publishEvent(this.props.modelId, 'notionalChanged', { notional:notional })}
          currencyPair={model.currencyPair}
        />
        <div className='clearfix'></div>
        {sparklineChart}
      </div>
    );
  }

  _createPriceComponents() {
    let model:SpotTileModel = this.state.model;
    let pricingContainerClass = classnames('currency-pair-actions', {'hide': model.hasNotification});
    if(model.currentSpotPrice === null) {
      return null;
    }
    return(
      <div className={pricingContainerClass}>
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
          onExecute={() => router.publishEvent(this.props.modelId, 'executeTrade', { direction:Direction.Buy })}
          rate={model.currentSpotPrice.ask}
        />
      </div>
    );
  }

  _createSparkLineChart() {
    let model = this.state.model;
    if (model.shouldShowChart && model.historicMidSportRates.length) {
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

  _tryCreateNotification() {
    let model : SpotTileModel = this.state.model;
    if (model.hasNotification) {
      if (model.notification.notificationType === NotificationType.Trade) {
        return (
          <TradeNotification
            tradeExecutionNotification={model.notification}
            onDismissedClicked={(e) => router.publishEvent(this.props.modelId, 'tradeNotificationDismissed', {})}
          />
        );
      } else if (model.notification.notificationType === NotificationType.Text) {
        return (
          <div className='summary-state text-notification animated flipInX'>{model.notification.message}</div>
        );
      } else {
        throw new Error(`Unknown notification type ${model.notification.notificationType}`);
      }
    }
    return null;
  }
}
