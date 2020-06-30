import { connectObservable } from 'react-rxjs'
import { blotter$, blotterConnection$ } from './services/blotterService'
export const [useBlotter] = connectObservable(blotter$)
export const [useBlotterConnection] = connectObservable(blotterConnection$)
