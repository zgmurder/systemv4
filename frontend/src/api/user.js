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
export function getRootOrg() {
  return queryFirst(`/resource/organization`, {
    where: {
      'parentId': {
        '$exists': false
      }
    }
  })
}
