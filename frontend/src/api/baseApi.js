import request from '@/utils/request'
// import { getUser } from '@/utils/auth'
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
export function fetchItem(url, id) {
  return request({
    url: `${url}/${id}`,
    method: 'GET'
  })
}
export function stopOrg(id, deactivated) {
  return request({
    url: 'resource/organization/deactivate/' + id,
    method: 'post',
    data: { deactivated }
  })
}
export function queryOrgs(obj) {
  const { sort, limit, ...where } = obj
  return queryList('resource/organization', {
    where,
    option: { sort, limit }
  })
}
export const queryLowerOrgs = (parentId, option = {}) => {
  const where = { parentId, deactivated: false }
  option.nodepart && (where['$or'] = [{ 'orgType': '分队' }, { 'orgType': '部队' }])
  option.allorg && (delete where.deactivated)
  return queryList('resource/organization', {
    where
  })
}
export const getServerDate = () => {
  let xhr = null
  if (window.XMLHttpRequest) {
    xhr = new window.XMLHttpRequest()
  } else {
    // ie
    // eslint-disable-next-line no-undef
    xhr = new ActiveObject('Microsoft')
  }
  xhr.open('GET', '/', false) // false不可变
  xhr.send(null)
  // eslint-disable-next-line no-unused-vars
  const dateObj = new Date(xhr.getResponseHeader('Date'))
  // new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  // new Date(2019,2,24)
  return new Date(2019, 2, 24)
}
