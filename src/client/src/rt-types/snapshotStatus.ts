/**
 * Provides a status of the instances for a given service type
 */

export interface SnapshotStatus {
  status: SnapshotActiveStatus
}

export enum SnapshotActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
