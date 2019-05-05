import Cookies from 'js-cookie'

const UserKey = 'vue_admin_template_userKey'
const TokenKey = 'vue_admin_template_tokenKey'
const ModuleKey = 'vue_admin_template_moduleKey'

export function getUser() {
  return Cookies.get(UserKey)
}

export function setUser(user) {
  return Cookies.set(UserKey, user)
}

export function removeUser() {
  return Cookies.remove(UserKey)
}
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getModuleName() {
  return Cookies.get(ModuleKey)
}
export function setModuleName(moduleName) {
  return Cookies.set(ModuleKey, moduleName)
}
export function removeModuleName() {
  return Cookies.remove(ModuleKey)
}
