import { combineEpics } from 'redux-observable'
import { openLinkWithOpenFinEpic } from './epics/openLinkInBrowser'

export const openfinEpic = combineEpics(openLinkWithOpenFinEpic)
