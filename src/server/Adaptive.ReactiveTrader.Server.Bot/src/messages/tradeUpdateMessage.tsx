import moment from 'moment';
import React, { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatNumber, Trade } from '../domain';
import '../extensions';

const sortPrices = (prices: Trade[]) =>
  prices.sort((a, b) => {
    return a.TradeDate < b.TradeDate ? -1 : a.TradeDate > b.TradeDate ? 1 : 0
  })

const numberCellStyle:React.CSSProperties = {
  textAlign:'right'
}

const TradesMessage: FC<{ trades: Trade[] }> = ({ trades }) => {
  const sorted = sortPrices(trades)
  return (
    <table>
      <thead>
        <tr>
          <th>TradeId</th>
          <th>Status</th>
          <th>Date</th>
          <th>Direction</th>
          <th>CCYCCY</th>
          <th>Dealt CCY</th>
          <th>Notional</th>
          <th>SpotRate</th>
          <th>Value Date</th>
          <th>Trader</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(trade => (
          <tr>
            <td>{trade.TradeId}</td>
            <td>{trade.Status}</td>
            <td>{moment(trade.TradeDate).format('DD MMM YY')}</td>
            <td>{trade.Direction}</td>
            <td>{trade.CurrencyPair}</td>
            <td>{trade.DealtCurrency}</td>
            <td style={numberCellStyle}>{formatNumber( trade.Notional)}</td>
            <td style={numberCellStyle}>{trade.SpotRate}</td>
            <td>{moment(trade.ValueDate).format('DD MMM YY')}</td>
            <td>{trade.TraderName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const tradeUpdateMessage = (trades: Trade[]) => renderToStaticMarkup(<TradesMessage trades={trades} />)
