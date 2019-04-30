import request from '@/utils/request'

export function queryUsersAndTotal({ where = {}, option = {}} = {}) {
  return Promise.all([
    request({
      url: '/account/users',
      method: 'post',
      data: { where, option }
    }),
    request({
      url: '/account/users/count',
      method: 'post',
      data: { where, option }
    })
  ]).then(([list, { count }]) => ({ list, total: count }))
}
export function queryUsers({ where = {}, option = {}} = {}) {
  return request({
    url: '/account/users',
    method: 'post',
    data: { where, option }
  })
}
export function queryRoles({ where = {}, option = {}} = {}) {
  return request({
    url: '/account/roles',
    method: 'post',
    data: { where, option }
  })
}

export function deleteUser(id) {
  return request({
    url: `/account/user/${id}`,
    method: 'DELETE'
  })
}
export function saveUser(user) {
  return request({
    url: `/account/user`,
    method: 'post',
    data: user
  })
}
export function updateUser(obj) {
  const { id, ...data } = obj
  return request({
    url: `/account/user/${id}`,
    method: 'PATCH',
    data
  })
}
