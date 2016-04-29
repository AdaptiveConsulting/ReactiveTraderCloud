import React from 'react';
import classnames from 'classnames';
import { ViewBase } from '../../common';
import { router } from '../../../system';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import { SpotTileModel, NotificationType } from '../model';
import { Direction } from '../../../services/model';
import moment from 'moment';
import './spotTile.scss';

const SPOT_DATE_FORMAT  = 'DD MMM';

export default class SpotTileView extends ViewBase {

  constructor() {
    super();
    this.state = {
      model: null,
      currencyChartIsOpening: false,
      currencyChartTimeoutId: -1
    };
  }

  componentWillUnmount(){
    super.componentWillMount();
    if (this.state.currencyChartIsOpening){
      window.clearTimeout(this.state.currencyChartTimeoutId);
    }
  }

  render() {
    let model:SpotTileModel = this.state.model;
    if (model === null) {
      return null;
    }
    let notionalInputClass = classnames('spot-tile__notional', {'hide': model.hasNotification});
    let spotDateClass = classnames('spot-tile__delivery', {'hide': model.hasNotification});
    let notification = this._tryCreateNotification();
    let priceComponents = this._createPriceComponents();
    let showChartIQIcon = model.isRunningInOpenFin;

    const chartIQIconClassName = classnames(
      {
        'spot-tile__icon--hidden': !showChartIQIcon,
        'glyphicon glyphicon-refresh spot-tile__icon--rotate': this.state.currencyChartIsOpening,
        'spot-tile__icon--tearoff glyphicon glyphicon-stats': !this.state.currencyChartIsOpening
      }
    );

    const formattedDate = model.currentSpotPrice ? moment(model.currentSpotPrice.valueDate).format(SPOT_DATE_FORMAT) : '';
    const className = classnames(
      'spot-tile',
      'animated',
      'flipInX',
      {
        'spot-tile--stale': !model.pricingConnected,
        'spot-tile--readonly': !model.executionConnected,
        'spot-tile--executing': model.isTradeExecutionInFlight,
        'spot-tile--error': model.hasNotification && model.notification.error
      }
    );
    return (
      <div className={className}>
        <div className='spot-tile__container'>
          <span className='spot-tile__stale-label'>Stale</span>
          <span className='spot-tile__symbol'>{model.tileTitle}</span>
          <span className='spot-tile__execution-label'>Executing</span>
          <div className='spot-tile__popout-controls'>
            <i className={chartIQIconClassName}
              onClick={() => this._displayCurrencyChart()}/>
            <i className='spot-tile__icon--tearoff glyphicon glyphicon-new-window'
               onClick={() => router.publishEvent(this.props.modelId, 'popOutTile', {})}/>
          </div>
          {notification}
          {priceComponents}
            <NotionalInput
              className={notionalInputClass}
              notional={model.notional}
              onChange={(notional) => router.publishEvent(this.props.modelId, 'notionalChanged', { notional:notional })}
              currencyPair={model.currencyPair} />
            <div className={spotDateClass}>
              <span className='spot-tile__tenor'>SP</span>
              <span className='spot-tile__delivery-date'>. {formattedDate}</span>
            </div>
        </div>
      </div>
    );
  }

  _displayCurrencyChart(){
    let timeoutId = setTimeout(()=> this.setState({currencyChartIsOpening: false}), 2000);
    this.setState({currencyChartTimeoutId: timeoutId, currencyChartIsOpening: true});
    router.publishEvent(this.props.modelId, 'displayCurrencyChart', {});
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
          className='spot-tile__price spot-tile__price--bid'
          direction={Direction.Sell}
          onExecute={() => this._onExecuteTrade(Direction.Sell)}
          rate={model.currentSpotPrice.bid} />
        <div className='spot-tile__price-movement'>
          <PriceMovementIndicator
            priceMovementType={model.currentSpotPrice.priceMovementType}
            spread={model.currentSpotPrice.spread} />
        </div>
        <PriceButton
          className='spot-tile__price spot-tile__price--ask'
          direction={Direction.Buy}
          onExecute={() => this._onExecuteTrade(Direction.Buy)}
          rate={model.currentSpotPrice.ask} />
      </div>
    );
  }

  _onExecuteTrade(direction: Direction) {
    if (this.state.model.executionConnected) {
      router.publishEvent(this.props.modelId, 'executeTrade', { direction });
    }
  }

  _tryCreateNotification() {
    let model:SpotTileModel = this.state.model;
    if (model.hasNotification) {
      if (model.notification.notificationType === NotificationType.Trade) {
        return (
          <TradeNotification
            className='spot-tile__trade-summary'
            tradeExecutionNotification={model.notification}
            onDismissedClicked={(e) => router.publishEvent(this.props.modelId, 'tradeNotificationDismissed', {})} />
        );
      } else if (model.notification.notificationType === NotificationType.Text) {
        return (
          <div className='spot-tile__notification-message'>{model.notification.message}</div>
        );
      } else {
        throw new Error(`Unknown notification type ${model.notification.notificationType}`);
      }
    }
    return null;
  }
}
