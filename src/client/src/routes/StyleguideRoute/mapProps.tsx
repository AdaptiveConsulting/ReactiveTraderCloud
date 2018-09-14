/**
 * Copied from @evanrs/map-props
 * https://github.com/evanrs/map-props
 */

import _ from 'lodash'

export type Selector = string | string[]
type CSS = null | false | string | string[]

interface MapPropsInputType {
  [key: string]: CSS | MapPropsInputTypeValue
}

type MapPropsInputTypeValue = boolean | CSS | MapPropsInputTypeFunc | MapPropsInputTypeMap
type MapPropsInputTypeFunc = (...args: any[]) => MapPropsReturnType
export interface MapPropsInputTypeMap {
  [key: string]: CSS | MapPropsInputTypeFunc
}

type MapPropsReturnType = CSS | MapPropsInputTypeFunc

interface ComponentPropsType {
  [key: string]: any
}

type ReducedType = MapPropsReturnType | MapPropsReturnType[]

// Map component props to css values
export const mapProps = (map: MapPropsInputType) => {
  const mapped = _.map(map, (mapValue, prop) => onProp(prop, mapValue))

  return (props: ComponentPropsType): ReducedType => {
    return mapped.reduce((acc, select) => {
      const value = select(props)
      if (value != null) {
        acc.push(value)
      }
      return acc
    }, [])
  }
}

// Map a single component prop to a css value (the bread and butter of mapProps)
export const onProp = (prop: Selector, mapValue: MapPropsInputTypeValue): MapPropsInputTypeFunc => {
  const { selectPropValue, selectThemeValue } = createSelectors(prop, mapValue)

  return props => {
    if (selectPropValue(props) != null) {
      return selectThemeValue(props)
    }
  }
}

// Select css given by
//  - mapValue[props[propKey]]
//  - mapValue(props, propKey, props[propKey],)
//  - mapValue
//  - props[propKey]
export const createSelectors = (prop: Selector, mapValue: MapPropsInputTypeValue) => {
  const propPath = _.toPath(prop)

  const fn = _.isFunction(mapValue) && mapValue
  const obj = _.isPlainObject(mapValue) && mapValue

  const selectPropValue = (source: ComponentPropsType): any => {
    let result

    for (let i = 0; i < propPath.length; i++) {
      result = source != null ? source[propPath[i]] : source
    }

    return result
  }

  const selectThemeValue = (props: ComponentPropsType) => {
    let propValue = selectPropValue(props)

    if (propValue === false) {
      return null
    }

    if (fn) {
      return fn(props, prop, propValue)
    }

    if (obj) {
      if (_.isFunction(propValue)) {
        propValue = propValue(props, prop, mapValue)
      }

      const mapped = mapValue[propValue]
      const fallback = mapValue['default']

      return (
        (propValue !== 'default' && mapped) ||
        (fallback && (_.isFunction(fallback) ? fallback(propValue, prop, props) : fallback)) ||
        null
      )
    }

    if (mapValue !== true) {
      return mapValue
    }

    return propValue
  }

  return {
    selectPropValue,
    selectThemeValue,
  }
}

export default mapProps
