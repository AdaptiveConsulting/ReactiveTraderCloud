import * as trades from "../trades"
import * as MOCKTRADES from "./trades"

const _trades = trades as unknown as typeof MOCKTRADES

export { _trades }
