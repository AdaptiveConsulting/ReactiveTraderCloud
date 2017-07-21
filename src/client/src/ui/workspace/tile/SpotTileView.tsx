import React from 'react';
import classnames from 'classnames';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import moment from 'moment/src/moment';
import './spotTile.scss';

const SPOT_DATE_FORMAT = 'DD MMM';

const direction = {
  Buy: 'Buy',
  Sell: 'Sell',
};

const notificationType = {
  Trade: 'Trade',
  Text: 'Text',
};

function replaceWithAction(a: any, b: any): void {
  return;
}

interface SpotTileViewProps {
  canPopout: boolean;
  currencyChartIsOpening: boolean;
  currencyPair: string;
  currentSpotPrice: number;
  executionConnected: boolean;
  hasNotification: boolean;
  isRunningInOpenFin: boolean;
  isTradeExecutionInFlight: boolean;
  maxNotional: number;
  notification: any;
  notional: number;
  priceStale: boolean;
  pricingConnected: boolean;
  title: string;
}

export default class SpotTileView extends React.Component<SpotTileViewProps, {}> {
  render() {
    const props = this.props;

    const notionalInputClass = classnames('spot-tile__notional', { hide: props.hasNotification });
    const spotDateClass = classnames('spot-tile__delivery', { hide: props.hasNotification });
    const notification = this._tryCreateNotification();
    const priceComponents = this._createPriceComponents();
    const showChartIQIcon = props.isRunningInOpenFin;

    const chartIQIconClassName = classnames({
      'spot-tile__icon--hidden': !showChartIQIcon,
      'glyphicon glyphicon-refresh spot-tile__icon--rotate': props.currencyChartIsOpening,
      'spot-tile__icon--chart glyphicon glyphicon-stats': !props.currencyChartIsOpening,
    });

    const formattedDate = props.currentSpotPrice ? moment(props.currentSpotPrice.valueDate).format(SPOT_DATE_FORMAT) : '';
    const className = classnames('spot-tile', {
      'spot-tile--stale': (!props.pricingConnected || props.priceStale) && !(props.hasNotification && props.notification.notificationType === notificationType.Trade),
      'spot-tile--readonly': !props.executionConnected,
      'spot-tile--executing': props.isTradeExecutionInFlight,
      'spot-tile--error': props.hasNotification && props.notification.error,
    });

    const newWindowClassName = classnames('popout__controls  glyphicon glyphicon-new-window', {
      'spot-tile__icon--tearoff': !props.canPopout,
      'spot-tile__icon--hidden': props.canPopout,
    });
    const spotTileContent = (
      <div>
        <span className="spot-tile__execution-label">Executing</span>
        {priceComponents}
        <NotionalInput
          className={notionalInputClass}
          notional={props.notional}
          onChange={notional => replaceWithAction('notionalChanged', { notional })}
          maxValue={props.maxNotional}
          currencyPair={props.currencyPair}/>
        <div className={spotDateClass}>
          <span className="spot-tile__tenor">SP</span>
          <span className="spot-tile__delivery-date">. {formattedDate}</span>
        </div>
      </div>
    );
    return (
      <div className={className}>
        <div className="spot-tile__container">
          <div className="spot-tile__controls">
            <i className={chartIQIconClassName}
               onClick={() => this._displayCurrencyChart()}/>
            <i className={newWindowClassName}
               onClick={() => replaceWithAction('popOutTile', {})}/>
            <i className="popout__undock spot-tile__icon--undock glyphicon glyphicon-log-out"
               onClick={() => replaceWithAction('undockTile', {})}/>
          </div>
          {!props.hasNotification ? spotTileContent : notification}
        </div>
      </div>
    );
  }

  _displayCurrencyChart() {
    replaceWithAction('displayCurrencyChart', {});
  }

  _createPriceComponents() {
    const props = this.props;
    const pricingContainerClass = classnames({ hide: props.hasNotification });
    if (props.currentSpotPrice === null) {
      return null;
    }
    return (
      <div className={pricingContainerClass}>
        <span className="spot-tile__symbol">{props.title}</span>
        <PriceButton
          className="spot-tile__price spot-tile__price--bid"
          direction={direction.Sell}
          onExecute={() => this._onExecuteTrade(direction.Sell)}
          rate={props.currentSpotPrice.bid}/>
        <div className="spot-tile__price-movement">
          <PriceMovementIndicator
            priceMovementType={props.currentSpotPrice.priceMovementType}
            spread={props.currentSpotPrice.spread}/>
        </div>
        <PriceButton
          className="spot-tile__price spot-tile__price--ask"
          direction={direction.Buy}
          onExecute={() => this._onExecuteTrade(direction.Buy)}
          rate={props.currentSpotPrice.ask}/>
      </div>
    );
  }

  _onExecuteTrade(direction:Direction) {
    if (this.props.executionConnected) {
      replaceWithAction('executeTrade', { direction });
    }
  }

  _tryCreateNotification() {
    const props = this.props;
    if (props.hasNotification) {
      if (props.notification.notificationType === notificationType.Trade) {
        return (
          <TradeNotification
            className="spot-tile__trade-summary"
            tradeExecutionNotification={props.notification}
            onDismissedClicked={e => replaceWithAction('tradeNotificationDismissed', {})}/>
        );
      } else if (props.notification.notificationType === notificationType.Text) {
        return (
          <div className="spot-tile__notification-message">{props.notification.message}</div>
        );
      } else {
        throw new Error(`Unknown notification type ${props.notification.notificationType}`);
      }
    }
    return null;
  }
}
