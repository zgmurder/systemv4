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
      breadcrumb: false,
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
        params: { defaultWhere: { inserviceStatus: 0 }},
        meta: {
          title: 'soldier',
          defaultWhere: { inserviceStatus: 0 }
        }
      },
      {
        path: 'retireSoldier',
        component: () => import('@/views/orgManage/soldier'),
        name: 'retireSoldier',
        meta: {
          title: 'retireSoldier',
          defaultWhere: { inserviceStatus: 1 }
        }
      },
      {
        path: 'trainer',
        component: () => import('@/views/orgManage/trainer'),
        name: 'trainer',
        meta: {
          title: 'trainer'
        }
      }
    ]
  },
  {
    path: '/placeManage',
    component: Layout,
    name: 'placeManage',
    meta: {
      title: 'placeManage',
      icon: 'chart',
      belong: 'organization'
    },
    children: [{
      path: 'place',
      component: () => import('@/views/orgManage/place'),
      name: 'place',
      meta: {
        title: 'place'
      }
    }]
  }
]

export default baseDataRouter
