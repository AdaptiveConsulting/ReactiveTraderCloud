import React from 'react';
import classnames from 'classnames';
import { ViewBase } from '../../common';
import { router } from '../../../system';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import { SpotTileModel, NotificationType } from '../model';
import { Direction } from '../../../services/model';
import './spotTile.scss';
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
    if (model === null) {
      return null;
    }
    let notionalInputClass = classnames('spot-tile__notional', {'hide': model.hasNotification});
    let notification = this._tryCreateNotification();
    let priceComponents = this._createPriceComponents();
    const className = classnames(
      'spot-tile',
      'animated',
      'flipInX',
      {
        'spot-tile--stale': !model.pricingConnected || !model.executionConnected,
        'spot-tile--executing': model.isTradeExecutionInFlight
      }
    );
    return (
      <div className={className}>
        <div className='spot-tile__container'>
          <span className='spot-tile__symbol'>{model.tileTitle} <i className='fa fa-plug animated infinite fadeIn'/></span>
          <span className='spot-tile__execution-label'>Executing</span>
          <i className='spot-tile__icon--tearoff fa fa-square-o'
             onClick={() => router.publishEvent(this.props.modelId, 'popOutTile', {})}/>
          {notification}
          {priceComponents}
            <NotionalInput
              className={notionalInputClass}
              notional={model.notional}
              onChange={(notional) => router.publishEvent(this.props.modelId, 'notionalChanged', { notional:notional })}
              currencyPair={model.currencyPair}
            />
        </div>
      </div>
    );
  }

  _createPriceComponents() {
    let model:SpotTileModel = this.state.model;
    let pricingContainerClass = classnames({'hide': model.hasNotification});
    if (model.currentSpotPrice === null) {
      return null;
    }
    return (
      <div className={pricingContainerClass}>
        <PriceButton
          className='spot-tile__price--bid'
          direction={Direction.Sell}
          onExecute={() => router.publishEvent(this.props.modelId, 'executeTrade', { direction:Direction.Sell })}
          rate={model.currentSpotPrice.bid}
        />
        <div  className='spot-tile__price-movement'>
          <PriceMovementIndicator
            priceMovementType={model.currentSpotPrice.priceMovementType}
            spread={model.currentSpotPrice.spread}
          />
        </div>
        <PriceButton
          className='spot-tile__price--ask'
          direction={Direction.Buy}
          onExecute={() => router.publishEvent(this.props.modelId, 'executeTrade', { direction:Direction.Buy })}
          rate={model.currentSpotPrice.ask}
        />
      </div>
    );
  }

  _tryCreateNotification() {
    let model:SpotTileModel = this.state.model;
    if (model.hasNotification) {
      if (model.notification.notificationType === NotificationType.Trade) {
        return (
          <TradeNotification
            className='spot-tile__trade-summary'
            tradeExecutionNotification={model.notification}
            onDismissedClicked={(e) => router.publishEvent(this.props.modelId, 'tradeNotificationDismissed', {})}
          />
        );
      } else if (model.notification.notificationType === NotificationType.Text) {
        return (
          <div className='spot-tile__trade-summary animated flipInX'>{model.notification.message}</div>
        );
      } else {
        throw new Error(`Unknown notification type ${model.notification.notificationType}`);
      }
    }
    return null;
  }
}
