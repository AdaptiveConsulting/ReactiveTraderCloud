import moment from 'moment';
import React, { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatNumber, Trade } from '../domain';

const TradeMessage: FC<{ trade: Trade }> = ({ trade }) => {
  const direction = trade.Direction === 'Buy' ? 'Bought' : 'Sold'

  return (
    <div>
      <p className="tempo-text-color--primary">{trade.TraderName} {direction} {trade.DealtCurrency}: {formatNumber(trade.Notional)} vs {trade.CurrencyPair.substr(2,5)}</p>
      <p><span className="tempo-text-color--secondary">Rate: </span>{trade.SpotRate}</p>
      <p><span className="tempo-text-color--secondary">Status: </span>{trade.Status}</p>
      <p><span className="tempo-text-color--secondary">Date: </span>{moment(trade.TradeDate).format('DD MMM YY')}</p>
      <p><span className="tempo-text-color--secondary">Trade Id: </span>{trade.TradeId}</p>
    </div>
  )
}

export const tradeNotificationMessage = (trade: Trade) => renderToStaticMarkup(<TradeMessage trade={trade} />)
