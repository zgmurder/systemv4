import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import RouterView from '@/layout/RouterView'

const constantRouterMap = [
  {
    path: '/',
    component: RouterView,
    // hidden: true,
    redirect: '/dashbroad',
    children: [{
      path: 'dashbroad',
      component: () => import('@/tableau/views/dashbroad')
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
