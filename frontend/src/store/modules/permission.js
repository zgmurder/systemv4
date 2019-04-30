import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roleName, route) {
  if (route.meta && route.meta.roles) {
    console.log(route.meta && route.meta.roles, 1111)

    return route.meta.roles.includes(roleName)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roleName) {
  const res = []
  console.log(routes, 2222)

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roleName, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roleName)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { roles } = data
    //     let accessedRouters
    //     if (roles.includes('admin')) {
    //       accessedRouters = asyncRouterMap
    //     } else {
    //       accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
    //     }
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // }
    GenerateRoutes({ commit }, roleName) {
      return new Promise(resolve => {
        console.log(roleName, 1111)

        const accessedRouters = filterAsyncRouter(asyncRouterMap, roleName)
        console.log(accessedRouters)

        // console.log(accessedRouters)

        // if (roleName === 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roleName)
        // }
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
