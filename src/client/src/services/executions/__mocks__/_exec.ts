import * as executions from "../executions"
import type * as MOCK_EXECUTIONS from "./executions"

export const execMock = executions as unknown as typeof MOCK_EXECUTIONS
