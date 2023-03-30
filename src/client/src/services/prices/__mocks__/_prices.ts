import * as prices from "../prices"
import * as MOCK_PRICES from "./prices"

const _prices = prices as unknown as typeof MOCK_PRICES

export { _prices }
