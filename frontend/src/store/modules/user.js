import { login, getOrg } from '@/api/user'
import { getToken, setToken, removeToken, setUser, removeUser } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import { mapModules } from '@/const'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],

  roleName: '',
  organization: null,
  permissions: [],
  moduleName: 'train'

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORGANIZATION: (state, organization) => {
    state.organization = organization
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_MODULENAME: (state, moduleName) => {
    state.moduleName = moduleName
  }
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { password } = userInfo
    const username = userInfo.username.trim()
    const { user, token } = await login({ username, password })
    setToken(token)
    commit('SET_TOKEN', token)
    if (user.organizationId) {
      user.organization = await getOrg(user.organizationId)
    }
    setUser(JSON.stringify(user))
    return { user, token }
  },

  saveToVuex({ commit, state }, user) {
    return new Promise((resolve) => {
      commit('SET_NAME', user.username)
      commit('SET_ROLENAME', user.roleName)
      commit('SET_PERMISSIONS', user.permissions)
      commit('SET_ORGANIZATION', user.organization)
      resolve(user)
    })
  },
  // 登出
  logout() {
    this.dispatch('user/saveToVuex', {}).then(() => {
      removeUser()
      removeToken()
      window.location.reload()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
