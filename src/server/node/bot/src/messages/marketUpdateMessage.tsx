import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { formatDate, formatDateTime, toRate } from '../utils'
import '../extensions'
import { Card } from '../components/Card'
import { downArrow, upArrow } from './data-images'
import { Price } from '../services'
import { CurrencyPair } from 'generated/TradingGateway'

const sortPrices = (prices: Price[]) =>
  prices.sort((a, b) => {
    return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0
  })

const imgStyle: React.CSSProperties = {
  paddingLeft: '2px'
}

const numberCellStyle: React.CSSProperties = {
  textAlign: 'right'
}

const arrowCellStyle: React.CSSProperties = {
  textAlign: 'center'
}
const MarketMessage: FC<{ prices: Price[]; currencyPairs: Record<string, CurrencyPair> }> = ({
  prices,
  currencyPairs
}) => {
  const sorted = sortPrices(prices)

  const Rate: FC<{ rawRate: number; symbol: string }> = ({ rawRate, symbol }) => {
    const settings = currencyPairs[symbol]
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

  return (
    <Card>
      <header>
        <b>Market Snapshot as of {formatDateTime(new Date())}</b>
      </header>
      <body>
        <table style={{ maxWidth: '500px' }}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th style={numberCellStyle}>Ask</th>
              <th style={numberCellStyle}>Bid</th>
              <th style={numberCellStyle}>Date</th>
              <th style={numberCellStyle}>Movement</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(price => (
              <tr key={price.symbol}>
                <td>{price.symbol}</td>
                <td style={numberCellStyle}>
                  <Rate rawRate={price.ask} symbol={price.symbol} />
                </td>
                <td style={numberCellStyle}>
                  <Rate rawRate={price.bid} symbol={price.symbol} />
                </td>
                <td style={numberCellStyle}>{formatDate(price.valueDate)}</td>
                <td style={arrowCellStyle}>
                  <img style={imgStyle} src={price.lastMove === 'up' ? upArrow : downArrow} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </Card>
  )
}

export const marketUpdateMessage = (prices: Price[], currencyPairs: Record<string, CurrencyPair>) =>
  renderToStaticMarkup(<MarketMessage prices={prices} currencyPairs={currencyPairs} />)
