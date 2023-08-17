import moment from 'moment'
import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Price } from '../domain'
import { getSpread, toRate } from '../domain'
import { downArrow, upArrow } from './data-images'

const BG_COLOR = '#2f3542'
const TEXT_PRIMARY_COLOR = '#FFFFFF'
const SECODARY_TEXT_COLOR = '#737987'
const TILE_COLOR = '#282d39'
const FONT_SIZE_MEDIUM = '13px'

const mediumTextStyle: React.CSSProperties = {
  fontSize: FONT_SIZE_MEDIUM,
  color: TEXT_PRIMARY_COLOR,
}

const CCYPairLabel: FC<{ pair: string }> = ({ pair }) => {
  const base = pair.substring(0, 3)
  const quote = pair.substring(3, 6)
  const label = `${base}/${quote}`
  return <p style={{ fontSize: FONT_SIZE_MEDIUM }}>{label}</p>
}

const directionLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  marginLeft: '18px',
  color: SECODARY_TEXT_COLOR,
}

const DirectionLabel: FC<{ label: string }> = ({ label }) => (
  <span style={directionLabelStyle}>{label}</span>
)

const ccyPairStyle: React.CSSProperties = {
  backgroundColor: TILE_COLOR,
  color: TEXT_PRIMARY_COLOR,
  display: 'inline-block',
  padding: '15px',
  width: '122px',
}

const innerTileStyle: React.CSSProperties = {
  backgroundColor: TILE_COLOR,
  textAlign: 'center',
  color: TEXT_PRIMARY_COLOR,
  marginTop: '-21px',
}
const CCYTile: FC<{ price: number; side: 'Bid' | 'Ask' }> = ({ side, price }) => {
  const rate = toRate(price, 5, 4)
  return (
    <div style={ccyPairStyle}>
      <DirectionLabel label={side} />
      <div style={innerTileStyle}>
        <span style={mediumTextStyle}>{rate.bigFigure}</span>
        <span style={{ fontSize: '34px' }}>{rate.pips}</span>
        <span style={mediumTextStyle}>{rate.pipFraction}</span>
      </div>
    </div>
  )
}

const spotTileMessageStyle: React.CSSProperties = {
  marginTop: '5px',
  backgroundColor: BG_COLOR,
  color: TEXT_PRIMARY_COLOR,
  padding: '20px',
  width: '330px',
}

const midStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: BG_COLOR,
  margin: '10px',
}

const imgStyle: React.CSSProperties = {
  paddingLeft: '2px',
}

const MovementIndicator: FC<{ price: Price }> = ({ price }) => {
  const spread = getSpread(price.ask, price.bid, 4, 5)

  return (
    <div style={midStyle}>
      {price.mid > 0 && <img style={imgStyle} src={upArrow} />}
      <p>{Math.abs(spread.value)}</p>
      {price.mid < 0 && <img style={imgStyle} src={downArrow} />}
    </div>
  )
}

const PriceMessage: FC<{ price: Price }> = ({ price }) => {
  return (
    <card accent="tempo-bg-color--blue" iconSrc="https://www.reactivetrader.com/favicon.ico">
      <header>
        Latest Prices for <cash tag={price.symbol} />
      </header>
      <body>
        <div className="entity" data-entity-id="entityIdentifier">
          <h4>
            <cash tag={price.symbol} /> as of: {moment().format('DD MMM LTS')}
          </h4>
          <div style={spotTileMessageStyle}>
            <CCYPairLabel pair={price.symbol} />
            <div style={{ backgroundColor: BG_COLOR, marginTop: 10 }}>
              <CCYTile price={price.bid} side="Bid" />
              <MovementIndicator price={price} />
              <CCYTile price={price.ask} side="Ask" />
            </div>
          </div>
        </div>
      </body>
    </card>
  )
}

export const createPriceMessage = (price: Price) =>
  renderToStaticMarkup(<PriceMessage price={price} />)
