import { login, getOrg } from '@/api/login'
import { getUser, setUser, removeUser, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getUser(),
    username: '',
    avatar: '',
    roles: [],
    roleName: '',
    permissions: [],
    organization: null,
    accessedRouters: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLENAME: (state, roleName) => {
      state.roleName = roleName
    },
    SET_ORGANIZATION: (state, organization) => {
      state.organization = organization
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    async Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const { user, token } = await login(username, userInfo.password)
      setToken(token)
      if (user.organizationId) {
        user.organization = await getOrg(user.organizationId)
      }
      setUser(JSON.stringify(user))
      return { user, token }
    },
    SaveToVuex({ commit, state }, user) {
      return new Promise((resolve) => {
        commit('SET_NAME', user.username)
        commit('SET_ROLENAME', user.roleName)
        commit('SET_PERMISSIONS', user.permissions)
        commit('SET_ORGANIZATION', user.organization)
        resolve(user)
      })
    },
    // 登出
    LogOut() {
      this.dispatch('SaveToVuex', {}).then(() => {
        removeUser()
        removeToken()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_NAME', '')
        commit('SET_ROLENAME', '')
        commit('SET_PERMISSIONS', [])
        removeUser()
        removeToken()
        resolve()
      })
    }
  }
}

export default user
