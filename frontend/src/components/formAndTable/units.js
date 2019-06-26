export const isEmpty = obj => JSON.stringify(obj) === '[]' || JSON.stringify(obj) === '{}' || !obj
export const cloneDeep = obj => {
  function deepCopy(obj) {
    const result = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
          result[key] = deepCopy(obj[key]) // 递归复制
        } else {
          result[key] = obj[key]
        }
      }
    }
    return result
  }
  return deepCopy(obj)
}
export const handleText = (text) => {
  if (typeof text === 'boolean') return text ? '是' : ''
}
const checkType = str => {
  return obj => Object.prototype.toString.call(obj) === '[object ' + str + ']'
}

// export const Type = (function () {
//   const type = {}
//   const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
//   typeArr.forEach(item => {
//     type[`is${item}`] = obj => Object.prototype.toString.call(obj) === '[object ' + item + ']'
//   })
//   type.isBoolean = obj => typeof obj === 'boolean'
//   type.isEmpty = obj => JSON.stringify(obj) === '[]' || JSON.stringify(obj) === '{}' || !obj
//   return type
// })()
export const type = {
  isString: obj => checkType('String')(obj),
  isObject: obj => checkType('Object')(obj),
  isNumber: obj => checkType('Number')(obj),
  isArray: obj => checkType('Array')(obj),
  isUndefined: obj => checkType('Undefined')(obj),
  isFunction: obj => checkType('Function')(obj),
  isNull: obj => checkType('Null')(obj),
  isSymbol: obj => checkType('Symbol')(obj),
  isEmpty
}
