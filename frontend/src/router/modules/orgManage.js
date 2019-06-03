/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const baseDataRouter = [
  {
    path: '/orgManage',
    component: Layout,
    name: 'orgManage',
    redirect: '/orgManage/orgList',
    meta: {
      title: 'orgManage',
      icon: 'chart',
      belong: 'organization'
    },
    children: [
      {
        path: 'orgList',
        component: () => import('@/views/orgManage/orgList'),
        name: 'orgList',
        meta: {
          title: 'orgList'
        }
      }
    ]
  },
  {
    path: '/soldierManage',
    component: Layout,
    name: 'soldierManage',
    redirect: '/soldierManage/soldier',
    meta: {
      title: 'soldierManage',
      icon: 'chart',
      belong: 'organization'
    },
    children: [
      {
        path: 'soldier',
        component: () => import('@/views/orgManage/soldier'),
        name: 'soldier',
        meta: {
          title: 'soldier'
        }
      }
    ]
  }

]

export default baseDataRouter
