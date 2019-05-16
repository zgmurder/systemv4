import request from '@/utils/request'
export function queryList(url, { where = {}, option = {}} = {}, { isTotal = false, isFirst = false } = {}) {
  url = isTotal ? url + 's/count' : url + 's'
  option = isFirst ? { ...option, limit: 1 } : option
  return request({
    url,
    method: 'post',
    data: { where, option }
  })
}
export function queryListAndTotal() {
  return Promise.all([
    queryList(...arguments),
    queryList(...arguments, { isTotal: true })
  ]).then(([list, { count }]) => ({ list, total: count }))
}
export function queryFirst() {
  return queryList(...arguments, { isFirst: true }).then(dataArr => dataArr[0])
}

export function deleteItem(url, id) {
  return request({
    url: `${url}/${id}`,
    method: 'DELETE'
  })
}
export function saveItem(url, data) {
  return request({
    url,
    method: 'post',
    data
  })
}

export function updateItem(url, obj) {
  const { id, ...data } = obj
  return request({
    url: `${url}/${id}`,
    method: 'PATCH',
    data
  })
}
