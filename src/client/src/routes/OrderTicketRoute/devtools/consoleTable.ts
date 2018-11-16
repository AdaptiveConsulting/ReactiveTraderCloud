import _ from 'lodash'

function consoleTable(data: any) {
  console.table(flatten(data))
}

function flatten(accumulator: any, parentValue?: any, parentKey?: any): any {
  if (arguments.length === 1) {
    ;[parentValue, accumulator] = [accumulator, {}]
  }
  if (!_.isObject(parentValue) && !_.isArray(parentValue)) {
    accumulator[parentKey] = parentValue
    return accumulator
  } else {
    return _.reduce(
      parentValue,
      (a, v, k) => {
        k = _.isArray(parentValue) ? `[${k}]` : k
        return flatten(a, v, parentKey ? `${parentKey}.${k}` : k)
      },
      accumulator,
    )
  }
}

export default consoleTable
export { consoleTable, flatten }
