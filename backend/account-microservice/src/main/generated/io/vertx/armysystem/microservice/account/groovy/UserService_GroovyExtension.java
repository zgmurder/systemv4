package io.vertx.armysystem.microservice.account.groovy;
public class UserService_GroovyExtension {
  public static io.vertx.armysystem.microservice.account.UserService addUser(io.vertx.armysystem.microservice.account.UserService j_receiver, java.util.Map<String, Object> user, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.addUser(user != null ? new io.vertx.armysystem.microservice.account.User(io.vertx.core.impl.ConversionHelper.toJsonObject(user)) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService retrieveUser(io.vertx.armysystem.microservice.account.UserService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveUser(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService retrieveByUsername(io.vertx.armysystem.microservice.account.UserService j_receiver, java.lang.String username, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveByUsername(username,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService retrieveAllUsers(io.vertx.armysystem.microservice.account.UserService j_receiver, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveAllUsers(principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.User>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.User>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> elt != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(elt.toJson()) : null).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService count(io.vertx.armysystem.microservice.account.UserService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.count(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Long> ar) {
        resultHandler.handle(ar.map(event -> event));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService retrieveUsersByCondition(io.vertx.armysystem.microservice.account.UserService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveUsersByCondition(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.User>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.armysystem.microservice.account.User>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> elt != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(elt.toJson()) : null).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService updateUser(io.vertx.armysystem.microservice.account.UserService j_receiver, java.util.Map<String, Object> user, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.updateUser(user != null ? new io.vertx.armysystem.microservice.account.User(io.vertx.core.impl.ConversionHelper.toJsonObject(user)) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService deleteUser(io.vertx.armysystem.microservice.account.UserService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.deleteUser(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService loginUser(io.vertx.armysystem.microservice.account.UserService j_receiver, java.lang.String username, java.lang.String password, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.loginUser(username,
      password,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.account.UserService updatePassword(io.vertx.armysystem.microservice.account.UserService j_receiver, java.lang.String username, java.lang.String oldPassword, java.lang.String newPassword, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.updatePassword(username,
      oldPassword,
      newPassword,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.armysystem.microservice.account.User> ar) {
        resultHandler.handle(ar.map(event -> event != null ? io.vertx.core.impl.ConversionHelper.fromJsonObject(event.toJson()) : null));
      }
    } : null));
    return j_receiver;
  }
}
