import * as trades from "../trades"
import type * as MOCKTRADES from "./trades"

export const tradesMock = trades as unknown as typeof MOCKTRADES
