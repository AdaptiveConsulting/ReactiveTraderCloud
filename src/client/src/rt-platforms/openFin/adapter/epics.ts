import { Action } from 'redux'
import { fromEventPattern, merge } from 'rxjs'
import { map, switchMapTo, mergeMap, delay } from 'rxjs/operators'
import { ActionsObservable, ofType } from 'redux-observable'
import flowRight from 'lodash/flowRight'
import { ApplicationEpic } from 'StoreTypes'
import {
  SetupAction,
  SETUP_ACTION_TYPES,
  WORKSPACE_ACTION_TYPES,
  LAYOUT_ACTION_TYPES,
  LayoutAction,
} from 'rt-actions'
import { setupWorkspaces, restoreWorkspace, saveWorkspace } from './workspaces'
import { isMainWindow, addApplicationEventHandler } from './window'
import { WorkspaceActions, WorkspaceAction, LayoutActions } from 'rt-actions'

const DELAY_SAVING_WORKSPACE = 2_000

// Initialise OpenFin workspace handlers
const workspacesHandler = setupWorkspaces()

/**
 * dispatch `updateContainerVisibilityAction` to create child windows
 * and relevant panels from the main window
 */
const initWorkspaceEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType<Action, SetupAction>(SETUP_ACTION_TYPES.SETUP),
    switchMapTo(workspacesHandler.pipe(map(LayoutActions.updateContainerVisibilityAction))),
  )

/**
 * Attempt to restore a previously persisted workspace
 */
const restoreWorkspaceEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType<Action, SetupAction>(SETUP_ACTION_TYPES.SETUP),
    mergeMap(async () => {
      if (await isMainWindow()) {
        restoreWorkspace()
      }

      return WorkspaceActions.restored()
    }),
  )

const saveWorkspaceEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType<Action, WorkspaceAction>(WORKSPACE_ACTION_TYPES.WORKSPACE_SAVE),
    /**
     * Delay workspace object generation and persisting to
     * ensure OpenFin windows have finished initialising
     */
    delay(DELAY_SAVING_WORKSPACE),
    mergeMap(async () => {
      if (await isMainWindow()) {
        await saveWorkspace()
      }

      return WorkspaceActions.saved()
    }),
  )

/**
 * List of Application events on which the current workspace
 * should be persisted to local storage
 */
const applicationEvents = [
  'window-bounds-changed',
  'window-minimized',
  'window-maximized',
  'window-restored',
]
const workspaceHandlersEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType<Action, SetupAction>(SETUP_ACTION_TYPES.SETUP),
    switchMapTo(
      merge(
        ...applicationEvents.map(event =>
          flowRight(fromEventPattern, addApplicationEventHandler)(event),
        ),
      ).pipe(map(WorkspaceActions.save)),
    ),
  )

/**
 * Persist the workspace when child windows are toggled
 */
const workspaceWindowsEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType<Action, LayoutAction>(LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE),
    map(WorkspaceActions.save),
  )

export const platformEpics: Array<ApplicationEpic> = [
  initWorkspaceEpic,
  restoreWorkspaceEpic,
  saveWorkspaceEpic,
  workspaceHandlersEpic,
  workspaceWindowsEpic,
]
