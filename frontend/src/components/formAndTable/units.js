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
