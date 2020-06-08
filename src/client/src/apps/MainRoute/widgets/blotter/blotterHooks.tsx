import { connectObservable } from '@josepot/react-rxjs'
import { blotter$ } from './services/blotterService'
export const [useBlotter] = connectObservable(blotter$)
