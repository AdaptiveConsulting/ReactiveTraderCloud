import { FlattenInterpolation } from 'styled-components'
type MappedProp<PropsType> =  MappedPropFn<PropsType>
type MappedPropFn<PropsType> = (props: PropsType & PassThroughProps) => FlattenInterpolation<PropsType>
export interface MappedPropMap<PropsType> {
  [key: string]: MappedProp<PropsType>
}
export interface PassThroughProps {
  [key: string]: any
}
