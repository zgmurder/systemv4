import request from '@/utils/request'

export function queryListAndTotal(url = '/account/users', { where = {}, option = {}} = {}) {
  url = url.toLocaleLowerCase()
  return Promise.all([
    request({
      url,
      method: 'post',
      data: { where, option }
    }),
    request({
      url: url + 's/count',
      method: 'post',
      data: { where, option }
    })
  ]).then(([list, { count }]) => ({ list, total: count }))
}
export function queryList(url, { where = {}, option = {}} = {}) {
  return request({
    url,
    method: 'post',
    data: { where, option }
  })
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
