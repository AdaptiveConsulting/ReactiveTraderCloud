import React from 'react';
import classnames from 'classnames';
import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import { Message } from '../../common/components';
import { PriceMovementIndicator, PriceButton } from './';
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
    let actionsClass = classnames('currency-pair-actions', {'hide': model.hasNotificationMessage});
    let sizerClass = classnames('sizer', {'hide': model.hasNotificationMessage});
    let message = model.hasNotificationMessage ? this._createMessage() : null;
    return (
      <div>
        <div className='currency-pair-title'>
          <i className='glyphicon glyphicon-stats pull-right'
             onClick={() => router.publishEvent(this.props.modelId, 'toggleSparkLineChart', {})}/>
          <span>{model.titleTitle}</span>
          <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {message}
        <div className={actionsClass}>
          <PriceButton
            direction={Direction.Sell}
            onExecute={() => router.publishEvent(this.props.modelId, 'sellClicked', {})}
            rate={model.currentSpotPrice.bid}
          />
          <PriceMovementIndicator
            priceMovementType={model.currentSpotPrice.priceMovementType}
            spread={model.currentSpotPrice.spread}
          />
          <PriceButton
            direction={Direction.Buy}
            onExecute={() => router.publishEvent(this.props.modelId, 'buyClicked', {})}
            rate={model.currentSpotPrice.ask}
          />
        </div>
        <div className='clearfix'></div>
        {
          // TODO finish porting
          //  <Sizer className={sizerClass} size={size} onChange={(size) => this.setState({size})} pair={pair}/>
        }
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

  _createMessage() {
    return <Message
      message={this.state.model.notificationMessage}
      onClick={(e) => router.publishEvent(this.props.modelId, 'notificationMessageDismissed', {})}
    />;
  }
}

export default SpotTileView;
