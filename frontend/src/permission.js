import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUser } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  let user = getUser()
  if (user) {
    user = JSON.parse(user)
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const usering = store.getters.user
      if (!usering) {
        const { organization, ...userData } = user
        store.commit('user/SET_ORGANIZATION', organization)
        store.commit('user/SET_USER', userData)
        store.dispatch('permission/generateRoutes', userData.roleName).then(accessRoutes => {
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        })
      } else {
        if (to.matched[0]) {
          const name = (to.matched[0].meta || {}).belong
          store.commit('permission/SET_MODULENAME', name)
          next()
        } else next('/404')
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
