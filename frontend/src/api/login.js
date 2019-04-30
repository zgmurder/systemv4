import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/account/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getOrg(id) {
  return request({
    url: `/army/organization/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
