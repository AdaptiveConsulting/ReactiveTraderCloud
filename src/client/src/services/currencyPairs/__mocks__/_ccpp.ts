import * as currencyPairs from "../currencyPairs"
import type * as MOCK_CURRENCYPAIRS from "./currencyPairs"

const _ccpp = currencyPairs as unknown as typeof MOCK_CURRENCYPAIRS

export { _ccpp }
