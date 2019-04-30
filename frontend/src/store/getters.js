const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  roleName: state => state.user.roleName,
  permissions: state => state.user.permissions,
  organization: state => state.user.organization
}
export default getters
