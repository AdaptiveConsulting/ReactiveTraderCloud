import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { formatDate, formatNumber } from '../utils'
import '../extensions'
import { Card } from '../components/Card'
import { Trade } from 'generated/TradingGateway'

type Prevalance = 'NORMAL' | 'HIGH'

const prevelanceMap = new Map<Prevalance, string>([
  ['NORMAL', 'tempo-bg-color--blue'],
  ['HIGH', 'tempo-bg-color--red']
])

const numberCellStyle: React.CSSProperties = {
  textAlign: 'right'
}
interface Props {
  trades: Trade[]
  label: string
  prevalance: Prevalance
}

const TradesMessage: FC<Props> = ({ trades, label, prevalance }) => {
  return (
    <>
      <Card accent={prevelanceMap.get(prevalance)}>
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
                <tr key={Number(trade.tradeId)}>
                  <td>{Number(trade.tradeId)}</td>
                  <td>{trade.status}</td>
                  <td>{formatDate(trade.tradeDate)}</td>
                  <td>{trade.direction}</td>
                  <td>{trade.currencyPair}</td>
                  <td>{trade.dealtCurrency}</td>
                  <td style={numberCellStyle}>{formatNumber(trade.notional)}</td>
                  <td style={numberCellStyle}>{trade.spotRate}</td>
                  <td>{trade.tradeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </body>
      </Card>
    </>
  )
}

export const tradeUpdateMessage = (
  trades: Trade[],
  label: string,
  prevelance: Prevalance = 'NORMAL'
) => renderToStaticMarkup(<TradesMessage trades={trades} label={label} prevalance={prevelance} />)
