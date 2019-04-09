package io.vertx.armysystem.microservice.account.groovy;
public class RoleService_GroovyExtension {
  public static io.vertx.armysystem.microservice.account.RoleService addRole(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.util.Map<String, Object> role, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.addRole(role != null ? new io.vertx.armysystem.microservice.account.Role(io.vertx.core.impl.ConversionHelper.toJsonObject(role)) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService retrieveRole(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.lang.String id, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveRole(id,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService retrieveByRoleName(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.lang.String roleName, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveByRoleName(roleName,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService retrieveAllRoles(io.vertx.armysystem.microservice.account.RoleService j_receiver, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveAllRoles(resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.Role>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.Role>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> elt != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(elt.toJson()) : null).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService count(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.util.Map<String, Object> condition, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.count(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Long> ar) {
        resultHandler.handle(ar.map(event -> event));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService retrieveRolesByCondition(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.util.Map<String, Object> condition, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveRolesByCondition(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.Role>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.Role>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> elt != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(elt.toJson()) : null).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.RoleService updateRole(io.vertx.armysystem.microservice.account.RoleService j_receiver, java.util.Map<String, Object> role, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.updateRole(role != null ? new io.vertx.armysystem.microservice.account.Role(io.vertx.core.impl.ConversionHelper.toJsonObject(role)) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.Role> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
}
