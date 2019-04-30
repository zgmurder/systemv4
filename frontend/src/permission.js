import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { Message } from 'element-ui'
import { getUser } from '@/utils/auth' // getUser from cookie
// import { type } from '@/utils/tools' // getUser from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration
function hasPermission(role, permissionRoles) {
  // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  // if (!permissionRoles) return true
  // return roles.some(role => permissionRoles.indexOf(role) >= 0)
  if (role === 'Administrator' || !permissionRoles) return true
  return permissionRoles.includes(role)
}
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  let user = getUser()
  if (user) {
    user = JSON.parse(user)
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.username) {
        store.dispatch('SaveToVuex', user).then(user => {
          console.log(user.roleName)

          store.dispatch('GenerateRoutes', user.roleName).then(routers => {
            console.log(1111)

            router.addRoutes(store.getters.addRouters)
          }).then(res => {
            console.log(to, 222)
            next({ ...to, replace: true })
          })
        })
      } else {
        if (hasPermission(store.getters.roleName, to.meta.roles)) {
          next()
        } else {
          next({
            path: '/401',
            replace: true,
            query: {
              noGoBack: true
            }
          })
        }
      }

      // if (type.isEmpty(store.getters.organization)) {
      //   store.dispatch('GetOrg').then(res => { // 拉取单位信息
      //     next()
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || 'Verification failed, please login again')
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      //   next()
      // }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
