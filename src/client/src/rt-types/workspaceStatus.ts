/**
 * Provides a status of the instances for a given service type
 */

export interface WorkspaceStatus {
  status: WorkspaceActiveStatus
}

export enum WorkspaceActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
