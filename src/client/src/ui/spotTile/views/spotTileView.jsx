import React from 'react';
import classnames from 'classnames';
import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import { Message } from '../../common/components';
import { PriceMovementIndicator, PriceButton, NotionalInput, TradeNotification } from './';
import { SpotTileModel, NotificationType } from '../model';
import { Direction, PriceMovementType } from '../../../services/model';

// TODO this should come back once the scss is cleaned up so it lives with it's components
// import './spotTileView.scss';

var _log:logger.Logger = logger.create('SpotTileView');

class SpotTileView extends ViewBase {

  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:SpotTileModel = this.state.model;
    if (!model || !model.currentSpotPrice) {
      return null;
    }
    let sparklineChart = this._createSparkLineChart();
    let pricingContainerClass = classnames('currency-pair-actions', {'hide': model.hasNotification});
    let notionalInputClass = classnames('sizer', {'hide': model.hasNotification});
    let notification = this._tryCreateNotification();
    return (
      <div>
        <div className='currency-pair-title'>
          <i className='glyphicon glyphicon-stats pull-right'
             onClick={() => router.publishEvent(this.props.modelId, 'toggleSparkLineChart', {})}/>
          <span>{model.tileTitle}</span>
          <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {notification}
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
          <div className='summary-state animated flipInX'>{model.notification.message}</div>
        );
      } else {
        throw new Error(`Unknown notification type ${model.notification.notificationType}`);
      }
    }
    return null;
  }
}

export default SpotTileView;
