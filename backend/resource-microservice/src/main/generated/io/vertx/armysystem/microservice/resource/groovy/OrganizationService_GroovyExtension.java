package io.vertx.armysystem.microservice.resource.groovy;
public class OrganizationService_GroovyExtension {
  public static io.vertx.armysystem.microservice.resource.OrganizationService addOne(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.addOne(item != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(item) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService retrieveOne(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService retrieveAll(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveAll(principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> io.vertx.core.impl.ConversionHelper.fromJsonObject(elt)).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService count(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.count(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Long> ar) {
        resultHandler.handle(ar.map(event -> event));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService retrieveManyByCondition(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveManyByCondition(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> io.vertx.core.impl.ConversionHelper.fromJsonObject(elt)).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService updateOne(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.lang.String id, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.updateOne(id,
      item != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(item) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService deleteOne(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.deleteOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService swapPosition(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.lang.String id, java.lang.String otherId, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.swapPosition(id,
      otherId,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.OrganizationService deactivate(io.vertx.armysystem.microservice.resource.OrganizationService j_receiver, java.lang.String id, java.lang.Boolean deactivated, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.deactivate(id,
      deactivated,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
}
