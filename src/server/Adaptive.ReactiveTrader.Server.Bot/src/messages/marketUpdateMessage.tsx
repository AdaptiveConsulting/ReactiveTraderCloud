import React, { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatDate, pairSettings, Price, toRate } from '../domain';
import '../extensions';
import logger from '../logger';

const sortPrices = (prices: Price[]) =>
  prices.sort((a, b) => {
    return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0
  })

const Rate: FC<{ rawRate: number; symbol: string }> = ({ rawRate, symbol }) => {
  const settings = pairSettings.get(symbol)!
  const format = (value: number) => toRate(value, settings.ratePrecision, settings.pipsPosition)
  const rate = format(rawRate)
  return (
    <>
      <span>{rate.bigFigure}</span>
      <b style={{ fontWeight: 'bold', fontSize: '16px' }}>{rate.pips}</b>
      <span>{rate.pipPrecision}</span>
    </>
  )
}

const numberCellStyle: React.CSSProperties = {
  textAlign: 'right',
}
const MarketMessage: FC<{ prices: Price[] }> = ({ prices }) => {
  const sorted = sortPrices(prices)

  return (
    <table style={({maxWidth:'500px'})}>
      <thead>
        <tr>
          <th>Symbol</th>
          <th style={numberCellStyle}>Ask</th>
          <th style={numberCellStyle}>Bid</th>
          <th style={numberCellStyle}>Date</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(price => (
          <tr>
            <td>{price.symbol}</td>
            <td style={numberCellStyle}>
              <Rate rawRate={price.ask} symbol={price.symbol} />
            </td>
            <td style={numberCellStyle}>
              <Rate rawRate={price.bid} symbol={price.symbol} />
            </td>
            <td style={numberCellStyle}>{formatDate(price.valueDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const marketUpdateMessage = (prices: Price[]) => renderToStaticMarkup(<MarketMessage prices={prices} />)
