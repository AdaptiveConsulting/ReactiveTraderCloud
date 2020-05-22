import React from 'react'
import { Col } from './resultsTable'

export const highlightPip = (value: number, bidAsk: 'bid' | 'ask') => {
  const array = String(value).split('')
  return array.map((char: string, index: number) => {
    const style =
      index === array.length - 2 || index === array.length - 1
        ? {
            color: bidAsk === 'ask' ? '#ff274b' : '#2d95ff',
            fontSize: '1rem',
          }
        : {}
    return (
      <span style={style} key={`${char}-${index}`}>
        {char}
      </span>
    )
  })
}

export const defaultColDefs: Col[] = [
  { title: 'Symbol', id: 'symbol' },
  {
    title: 'Ask',
    id: 'ask',
    align: 'right',
    formatter: value => highlightPip(value, 'ask'),
    fixedWidth: true,
  },
  { title: 'Mid', id: 'mid', align: 'right', fixedWidth: true },
  {
    title: 'Bid',
    id: 'bid',
    align: 'right',
    formatter: value => highlightPip(value, 'bid'),
    fixedWidth: true,
  },
  { title: 'Movement', id: 'priceMovementType', align: 'center' },
  { title: 'Date/Time', id: 'valueDate' },
  { title: '', id: 'openTileBtn', align: 'center', fixedWidth: true },
]
