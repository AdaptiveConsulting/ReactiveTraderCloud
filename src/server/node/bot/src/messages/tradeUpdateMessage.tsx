import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { formatDate, formatNumber, Trade } from '../domain'
import '../extensions'

type Prevalance = 'NORMAL' | 'HIGH'

const prevelanceMap = new Map<Prevalance, string>([
  ['NORMAL', 'tempo-bg-color--blue'],
  ['HIGH', 'tempo-bg-color--red'],
])

const numberCellStyle: React.CSSProperties = {
  textAlign: 'right',
}
interface Props {
  trades: Trade[]
  label: string
  prevalance: Prevalance
}

const TradesMessage: FC<Props> = ({ trades, label, prevalance }) => {
  return (
    <>
      <card
        accent={prevelanceMap.get(prevalance)}
        iconSrc="https://www.reactivetrader.com/favicon.ico"
      >
        <header>{label}</header>
        <body>
          <table>
            <thead>
              <tr>
                <th>TradeId</th>
                <th>Status</th>
                <th>Date</th>
                <th>Direction</th>
                <th>CCY</th>
                <th>Dealt CCY</th>
                <th style={numberCellStyle}>Notional</th>
                <th style={numberCellStyle}>SpotRate</th>
                <th>Trader</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr>
                  <td>{trade.TradeId}</td>
                  <td>{trade.Status}</td>
                  <td>{formatDate(trade.TradeDate)}</td>
                  <td>{trade.Direction}</td>
                  <td>{trade.CurrencyPair}</td>
                  <td>{trade.DealtCurrency}</td>
                  <td style={numberCellStyle}>{formatNumber(trade.Notional)}</td>
                  <td style={numberCellStyle}>{trade.SpotRate}</td>
                  <td>{trade.TraderName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </body>
      </card>
    </>
  )
}

export const tradeUpdateMessage = (
  trades: Trade[],
  label: string,
  prevelance: Prevalance = 'NORMAL'
) => renderToStaticMarkup(<TradesMessage trades={trades} label={label} prevalance={prevelance} />)
