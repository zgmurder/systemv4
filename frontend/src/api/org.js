import request from '@/utils/request'
export function queryOrgs({
  where = {},
  option = {}
} = {}) {
  return request({
    url: '/army/organizations',
    method: 'post',
    data: {
      where,
      option
    }
  })
}
