import request from '@/utils/request'
import { queryFirst } from './baseApi'

export function login(data) {
  return request({
    url: 'account/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
const getRootOrg = () => {
  return queryFirst(`/resource/organizations`, {
    where: {
      'parentId': {
        '$exists': false
      }
    }
  })
}
export function getOrg(id) {
  return id ? request({
    url: `/resource/organization/${id}`,
    method: 'get'
  }) : getRootOrg()
}
