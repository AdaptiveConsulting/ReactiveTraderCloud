export type CamelCase<T> = { [P in keyof T & string as Uncapitalize<P>]: T[P] }

export interface CollectionUpdates {
  IsStateOfTheWorld: boolean
  IsState: boolean
}

export enum UpdateType {
  Added = "Added",
  Removed = "Removed",
}

export interface CollectionUpdate {
  UpdateType: UpdateType
}
