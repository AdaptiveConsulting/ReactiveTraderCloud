import { Canvas } from './items/canvas'
import { CanvasApplicationConfig } from '../../../schemas/app/application'
import {
  InnerCanvas,
  SaveOptions,
  CanvasEventType,
  CanvasItem,
  WorkspaceHibernationSettings,
} from './types'
import { UnsubscribeFunction } from 'callback-registry'
import { JsSerializeFrameResult } from '../../bridge/types'
import { FrameWrapper } from './frameWrapper'
import { Bounds } from '../types/window'
import {
  LayoutType,
  SwimlaneLayout,
  LayoutData,
  SwimlaneCanvas,
  CanvasLayoutState,
} from '../../../schemas/app/main'
import Layout from '../../layouts/layout'

export interface CanvasAPI {
  /**
   * Opens a saved workspace in either a new canvas frame or the last opened canvas frame.
   * Can be used from any app running in Connect
   *
   * @param workspaceName name of the workspace to open
   * @param options an object used to overwrite default open options and pass a context that will be applied to any activity in the workspace
   * @param success success callback
   * @param error error callback
   */
  openWorkspace(workspaceName: string, options?: RestoreOptions): Promise<WorkspaceData>

  openWorkspaceAs(
    workspaceName: string,
    appName: string,
    title: string,
    context: object,
    success?: () => void,
    error?: () => void,
  ): void

  openWorkspace2(
    workspaceName: string,
    options?: LegacyRestoreOptions,
    success?: (workspaceData: WorkspaceData) => void,
    error?: (errorMessage?: string) => void,
  ): Promise<WorkspaceData>

  /**
   * Opens a new workspace in either a new canvas frame or the canvas frame of the calling window, if it is running in canvas.
   * @param workspaceConfig name of the workspace to open
   */
  createWorkspace(workspaceConfig: WorkspaceConfig): Promise<WorkspaceData>

  getWorkspaces(filter: WorkspaceFilter): Workspace[]

  selectWorkspace(options: SelectWorkspaceOptions, success?: () => void, error?: () => void): void

  addTab(
    title: string,
    lanes: number,
    horizontal: boolean,
    success?: () => void,
    error?: () => void,
  ): Promise<WorkspaceData>

  addTabWithApps(
    title: string,
    lanes: number,
    horizontal: boolean,
    apps: CanvasApplicationConfig[],
    success?: () => void,
    error?: () => void,
  ): Promise<WorkspaceData>

  addWindow(app: CanvasApplicationConfig, success?: () => void, error?: () => void): void

  addCanvas(
    args: InnerCanvas,
    success: (canvasId: string) => void,
    error: (err: string) => void,
  ): Promise<string>

  getCurrentTab(): WorkspaceTabInfo

  getPossibleMoveDirections(): void

  moveCurrentTab(): void

  getLayouts(): LayoutShortInfo[]

  /**
   * Returns a list of the ids of all open canvas frames
   *
   * @param success success callback
   */
  listFrames(success: (frameIds: string[]) => void): Promise<string[]>

  /**
   * Closes an open frame. If no frameId is provided this will close the frame in which the window is located
   *
   * @param frameId The id of the frame to close. If omitted will close the frame in which the window is located
   * @param closeOptions an object used to overwrite the default settings when closing a frame
   * @param success success callback
   * @param error error callback
   */
  closeFrame(
    frameId?: string,
    closeOptions?: FrameCloseOptions,
    success?: () => void,
    error?: (errorMessage?: string) => void,
  ): Promise<void>

  getCanvasId(
    properties: CanvasProperties,
    success: (canvasId: string) => void,
    error: (err: string) => void,
  ): any

  saveLayout(
    name: string,
    options: SaveOptions,
    success: () => void,
    error: () => void,
  ): Promise<SwimlaneLayout | Layout>

  restoreLayout(
    name: string,
    success: (layout: WorkspaceData) => void,
    error: () => void,
  ): Promise<WorkspaceData>

  deleteLayout(name: string, success: () => void, error: (error?: string) => void): Promise<void>

  focus(windowId: string): Promise<void>

  focusWindow(
    options: { windowId?: string; activityId?: string; applicatioName?: string },
    success: () => void,
    error: (error?: string) => void,
  ): Promise<void>

  exportLayouts(): SwimlaneLayout[] | LayoutData[]

  importLayouts(layouts: SwimlaneLayout[] | LayoutData[]): Promise<ImportLayoutResult>

  /**
   * Returns true if the calling window is running in canvas
   */
  inCanvas(): boolean

  closeWorkspace(
    workspaceId?: string,
    success?: () => void,
    error?: (errorMessage: string) => void,
  ): Promise<void>

  closeWindow(
    options: {
      windowId?: string
      activityId?: string
      applicationName?: string
      workspaceId?: string
    },
    success?: () => void,
    error?: (errorMessage: string) => void,
  ): Promise<void>

  serializeWorkspace(workspaceId?: string): SwimlaneCanvas

  serializeWorkspaceAsync(workspaceId?: string): Promise<SwimlaneCanvas>

  serializeFrame(extraInfo: boolean, frameId: string): SwimlaneCanvas

  serializeFrameAsync(
    extraInfo: boolean,
    frameId: string,
    success?: () => void,
  ): Promise<SwimlaneCanvas>

  serializeFrameGtf(frameId?: string): Promise<CanvasLayoutState>

  setTitle(title: string, canvasId?: string): Promise<void>

  setWindowTitle(
    options: string | LazyLoadedWindowInfo & { title?: string; windowId?: string },
    success?: () => void,
    error?: (err: string) => void,
  ): Promise<void>

  setSize(
    settings: SizeSettings,
    success?: (args: ResizeSuccessData) => void,
    error?: (err: string) => void,
  ): Promise<ResizeSuccessData>

  configure(
    settings: CanvasWindowOptions,
    success?: () => void,
    error?: (err: string) => void,
  ): Promise<void>

  setWindowMaximized(isMaximized: boolean): Promise<void>

  isWindowMaximized(): boolean

  addLane(laneIndex: number): void

  removeLane(index: number): Promise<void>

  subscribe(
    eventName: CanvasEventType,
    eventCallback: (eventData?: any) => void,
  ): UnsubscribeFunction

  subscribeLayoutEvents(eventCallback: () => void): UnsubscribeFunction
}

export interface WorkspaceData {
  frameId: string
  workspaceId: string
}

export interface FrameCloseOptions {
  // Disables the canvas modified alert when closing
  ignoreModifiedAlert: boolean
}

export interface SizeSettings {
  width?: number
  height?: number
  fixed?: boolean
}

export interface SizeConfig {
  width: number
  height: number
}

export interface ResizeSuccessData {
  newSize: SizeConfig
  oldSize: SizeConfig
}

export interface WorkspaceConfig {
  title: string
  lanes: number
  horizontal: boolean
  apps?: CanvasApplicationConfig[]
  frameId?: string
  workspaceContext?: {
    [k: string]: any
  }
  bounds?: {
    /**
     * Coordinate on the horizontal axis
     */
    left?: number
    /**
     * Coordinate on the vertical axis
     */
    top?: number
    /**
     * Width of the app's window
     */
    width?: number
    /**
     * Height of the app's window
     */
    height?: number
  }
  /**
   * If set window will start in the specified state (maximized, minimized, normal)
   */
  windowState?: string
}

/**
 * Properties specified when getting specific canvas id
 * Note that windowId has priority, i.e. if specified, the rest are not checked
 * Also, if no properties are specified, returns the current window canvas id
 */
export interface CanvasProperties {
  /** window id which is in the target canvas */
  windowId?: string

  /** parent canvas id, defaults to current window's canvas */
  canvasId?: string
  /** lane and position in lane for the target canvas */
  lane?: number
  positionInLane?: number
}

export interface CanvasWindowOptions extends CanvasWindowConfigSettings {
  fixedWidth?: number
  fixedHeight?: number
  showTabCloseButton?: boolean
}

export interface CanvasWindowConfigSettings {
  maxWidth?: number
  minWidth?: number
  maxHeight?: number
  minHeight?: number
  disableTileMode?: boolean
}

export interface LazyLoadedWindowInfo {
  applicationName?: string
  workspaceId?: string
  activityId?: string
}

export interface WorkspaceTabInfo {
  activityId: string
  apps: string[]
  canvasId: string
  workspaceId: string
  horizontal: boolean
  laneCount: number
  title: string
}

export interface LegacyRestoreOptions {
  app?: string
  context?: object
  restoreType?: RestoreType
  title?: string
  inNewFrame?: boolean
  /* screenRatio > 0 && screenRatio <= 1 */
  screenRatio?: number
  state?: 'maximized' | 'normal'
  /* default is false */
  ignoreSavedLocation?: boolean
  /* can be centerScreen or left/top for example: "centerScreen" | "100, 100" */
  startLocation?: string
  reuseWorkspace?: string
  lockdown?: boolean
  activated?: boolean
}

export interface RestoreOptions {
  app?: string
  context?: object
  restoreType?: RestoreType
  title?: string
  reuseWorkspaceId?: string
  frameId?: string
  lockdown?: boolean
  activateFrame?: boolean
  newFrame?: NewFrameConfig | boolean
  inMemoryLayout?: boolean
}

export interface NewFrameConfig {
  location?: { left?: number; top?: number } | 'centerScreen'
  size?: { width?: number; height?: number; screenRatio?: number }
  ignoreSavedLocation?: boolean
  state?: 'maximized' | 'normal'
}

export type RestoreType = 'direct' | 'delayed' | 'lazy'

export interface ImportLayoutResult {
  status: string
  failed: Array<{
    name: string
    type: LayoutType
  }>
}

export interface LayoutShortInfo {
  name: string
  lastSaveTime: string
  metadata: object
}

// GD2 backward signature
export interface WorkspaceFilter {
  activityId: string
}

// GD2 backward signature
export interface Workspace {
  activities: Activity[]
  applications: Application[]
  selected: boolean
  frameId: string
  hibernated: boolean
  workspaceId: string
  workspaceTitle: string
  lockedDown: boolean
  openTime: Date
}

// GD2 backward signature
export interface Activity {
  activityContext: object
  activityId: string
  activityType: string
}

// GD2 backward signature
export interface Application {
  name: string
  loaded: boolean
  activityId: string
}

// GD2 backward signature
export interface SelectWorkspaceOptions {
  workspaceId: string
  activityContext: object
}
