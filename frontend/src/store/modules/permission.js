import { constantRouterMap, asyncRouterMap } from '@/router'
import { mapModules } from '@/const'
import { getModuleName } from '@/utils/auth'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roleName, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roleName)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roleName) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roleName, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roleName)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  mapModules: [],
  moduleName: ''
}

const mutations = {
  SET_ROUTES: (state, routers) => {
    state.addRoutes = routers
    state.routes = constantRouterMap.concat(routers)
  },
  SET_MODULENAME: (state, moduleName) => {
    state.moduleName = moduleName
  }
}

const actions = {
  generateRoutes({ commit, state }, roleName) {
    state.mapModules = mapModules.filter(item => item.roles ? item.roles.includes(roleName) : true)
    const name = getModuleName() || state.mapModules[0].value
    console.log(roleName, name)

    commit('SET_MODULENAME', name)
    return new Promise(resolve => {
      const accessedRouters = filterAsyncRoutes(asyncRouterMap, roleName)
      commit('SET_ROUTES', accessedRouters)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
