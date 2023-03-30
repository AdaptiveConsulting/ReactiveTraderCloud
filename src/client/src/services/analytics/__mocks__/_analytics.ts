import * as analytics from "../analytics"
import * as MOCK_ANALYTICS from "./analytics"

const _analytics = analytics as unknown as typeof MOCK_ANALYTICS

export { _analytics }
