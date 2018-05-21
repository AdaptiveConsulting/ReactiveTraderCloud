/**
 * Typesctipt definitions for creating actions and action creators.
 * This allows us to fully type epics and reducers without boiler plate
 */

import { ActionCreatorsMapObject } from 'redux'

/**
 * Type Definitions for Action types
 */

export interface Action<T extends string> {
  type: T
}

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P
  error: boolean
}

export interface ActionWithPayloadAndMeta<T extends string, P, M> extends ActionWithPayload<T, P> {
  meta: M
}

/**
 * Type Definitions for Action Creators
 */

type ActionFn<T extends string> = () => Action<T>

type ActionWithPayloadFn<T extends string, P> = (payload: P) => ActionWithPayload<T, P>

type ActionWithPayloadAndMetaFn<T extends string, P, M> = (payload: P, meta: M) => ActionWithPayloadAndMeta<T, P, M>

export function action<T extends string>(type: T): ActionFn<T>
export function action<T extends string, P>(type: T): ActionWithPayloadFn<T, P>
export function action<T extends string, P, M>(type: T): ActionWithPayloadAndMetaFn<T, P, M>
export function action(type: string) {
  return (payload?: any, meta?: any) => {
    if (payload === undefined) {
      return { type }
    }

    if (meta !== undefined) {
      return { type, payload, meta }
    }

    const error = payload instanceof Error
    return { type, payload, error }
  }
}

export type ActionUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>
