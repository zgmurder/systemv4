
export const type = (() => {
  const type = {}
  const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
  typeArr.forEach(item => {
    type[`is${item}`] = obj => Object.prototype.toString.call(obj) === '[object ' + item + ']'
  })
  type.isBoolean = obj => typeof obj === 'boolean'
  type.isEmpty = obj => JSON.stringify(obj) === '[]' || JSON.stringify(obj) === '{}' || !obj
  return type
})()

