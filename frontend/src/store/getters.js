const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  user: state => state.user.user,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  roleName: state => state.user.roleName,
  username: state => state.user.name,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  mapModules: state => state.permission.mapModules,
  moduleName: state => state.permission.moduleName,
  organization: state => state.user.organization,
  errorLogs: state => state.errorLog.logs
}
export default getters
