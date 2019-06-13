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
export function startStandard(id, activate) {
  return request({
    url: 'standard/trainstandard/activate/' + id,
    method: 'post',
    data: { activate }
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

