
export function cleanData(obj) {
  // eslint-disable-next-line no-unused-vars
  const { ACL, createdAt, updatedAt, ...data } = obj
  data.className = obj.className
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'object' && data[key].toJSON) {
      data[key] = cleanData(data[key])
    }
  })
  return data
}

export const Type = (function() {
  const type = {}
  const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
  typeArr.forEach(item => {
    type[`is${item}`] = obj => Object.prototype.toString.call(obj) === '[object ' + item + ']'
  })
  type.isBoolean = obj => typeof obj === 'boolean'
  type.isEmpty = obj => JSON.stringify(obj) === '[]' || JSON.stringify(obj) === '{}' || !obj
  return type
})()

export default {
  ...Type,
  cleanData,
  // isEmpty(paramas) {
  //   if (typeof parmas === 'object') {
  //     const str = JSON.stringify(paramas)
  //     return str === '[]' || str === '{}'
  //   } else {
  //     return !!paramas
  //   }
  // },
  strToArr(str) {
    if (!str || str.length === 0) return []
    if (typeof str !== 'string') return str
    str = str.replace(/，|\\|\\n/ig, ',').trim().split(',')
    const arr = [...new Set(str)]
    const len = arr.length
    if (arr[len - 1] === '') arr.length = len - 1
    return arr
  },
  debounce(fun, delay = 500) {
    fun.timer = null
    return function(...args) {
      const that = this
      clearTimeout(fun.timer)
      fun.timer = setTimeout(() => {
        fun.apply(that, args)
      }, delay)
    }
  },
  cloneDeep(obj) {
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
  },
  handlerEmpty(obj) {
    if (this.isBoolean(obj)) return obj ? '是' : '否'
    // else if (moment.isDate(empty)) return this.format(empty);
    else if (this.isNumber(obj)) return obj
    else if (this.isEmpty(obj)) return ''
    else return obj
  },
  uniq(arr) {
    return [...new Set(arr)]
  },
  parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },
  distanceToday(field) {
    return this.timeObj[field].bind(this)
  },
  dateToJSON(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return { year, month, day }
  },
  timeObj: {

    year(value) {
      const birthDay = this.dateToJSON(new Date(value))
      const toDay = this.dateToJSON(new Date())

      const diffYear = toDay.year - birthDay.year
      const diffMonth = toDay.month - birthDay.month
      const diffDay = toDay.day - birthDay.day

      return (diffMonth < 0 || (!diffMonth && diffDay < 0)) ? diffYear - 1 : diffYear
      // if ((toDay.year - birthDay.year) > 0){
      //   if ((toDay.month - birthDay.month) > 0) returnAge =
      // }

      // if (toDay.year === birthDay.year) {
      //   returnAge = 0 // 同年 则为0岁
      // } else {
      //   const ageDiff = nowYear - birthYear // 年之差
      //   if (ageDiff > 0) {
      //     if (nowMonth == birthMonth) {
      //       var dayDiff = nowDay - birthDay // 日之差
      //       if (dayDiff < 0) {
      //         returnAge = ageDiff - 1
      //       } else {
      //         returnAge = ageDiff
      //       }
      //     } else {
      //       var monthDiff = nowMonth - birthMonth // 月之差
      //       if (monthDiff < 0) {
      //         returnAge = ageDiff - 1
      //       } else {
      //         returnAge = ageDiff
      //       }
      //     }
      //   } else {
      //     returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
      //   }
      // }
    }
  }
}
