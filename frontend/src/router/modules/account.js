/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accountRouter = [
  {
    path: '/account',
    component: Layout,
    belong: ['account'],
    redirect: '/account/index',
    meta: {
      belong: 'account'
    },
    children: [{
      path: 'index',
      name: 'account',
      component: () => import('@/views/account/index'),
      meta: {
        title: 'account',
        icon: 'form'
      }
    }]
  }
]

export default accountRouter
