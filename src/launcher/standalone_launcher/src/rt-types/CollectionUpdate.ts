import { UpdateType } from '.'

export interface CollectionUpdate {
  UpdateType: UpdateType
}

export interface CollectionUpdates {
  IsStateOfTheWorld: boolean
  IsStale: boolean
}
