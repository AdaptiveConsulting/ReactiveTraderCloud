import { ExcelAdapterName } from './excel'

export type ExcelAdapterName = ExcelAdapterName

export { default as OpenFin, setupWorkspaces } from './openFin'
export { openDesktopWindow } from './window'
export { excelAdapter } from './excel'
export { platformEpics } from './epics'
export { platformReducers } from '../../reducer'
