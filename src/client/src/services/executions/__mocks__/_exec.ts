import * as executions from "../executions"
import * as MOCK_EXECTUTIONS from "./executions"

const _exec = executions as unknown as typeof MOCK_EXECTUTIONS

export { _exec }
