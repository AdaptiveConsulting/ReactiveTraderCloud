export const SYMPHONY_APP_ID = process.env.REACT_APP_SYMPHONY_APP_ID || 'reactiveTrader' 
export const FX_ENTITY_TYPE = 'com.adaptive.fx'

export const createTileMessage = (host:string, symbol: string) => `<entity><iframe style="height: 190px;" src="${host}/spot/${symbol}/?tileView=Normal"/></entity>`
export const placeholderMessage = `<entity><div style="height: 190px;background-color:#2f3542;">Paused</div></entity>`
