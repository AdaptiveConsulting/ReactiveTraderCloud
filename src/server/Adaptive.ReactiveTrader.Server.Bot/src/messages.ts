import moment from "moment";
import { Price } from "./domain";

export const createPriceMessage = (price: Price) => `
  <h3>${price.symbol}</h3>
  <p>Bid: <b>${price.bid}</b></p>
  <p>Ask: <b>${price.ask}</b></p>
  <p>Mid: <b>${price.mid}</b></p>
  <p>Time: <b>${moment().format('DD MMM LTS')}</b></p>
  <p>For Live prices see: <a href="https://web-demo.adaptivecluster.com/spot/${price.symbol}?tileView=Analytics">Reactive Trader</a></p>
`