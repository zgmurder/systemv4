import { routeModules, constantRoutes } from '@/router'
import { mapModules } from '@/const'

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
  SET_ROUTES: (state, moduleName) => {
    state.addRoutes = routeModules[moduleName]
    state.routes = constantRoutes.concat(state.addRoutes)
  },
  SET_MAPMODULES: (state, roleName) => {
    state.mapModules = mapModules.filter(item => item.roles ? item.roles.includes(roleName) : true)
    // state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit, state }, roleName) {
    state.mapModules = mapModules.filter(item => item.roles ? item.roles.includes(roleName) : true)
    state.moduleName = state.mapModules[0].value
    commit('SET_ROUTES', state.moduleName)
    return new Promise(resolve => {
      resolve(state.routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
