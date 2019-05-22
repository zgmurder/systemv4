package io.vertx.armysystem.microservice.resource.groovy;
public class SoldierService_GroovyExtension {
  public static io.vertx.armysystem.microservice.resource.SoldierService addOne(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.addOne(item != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(item) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService retrieveOne(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService retrieveAll(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveAll(principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> io.vertx.core.impl.ConversionHelper.fromJsonObject(elt)).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService count(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.count(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Long>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Long> ar) {
        resultHandler.handle(ar.map(event -> event));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService retrieveManyByCondition(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.util.Map<String, Object> condition, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveManyByCondition(condition != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(condition) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> io.vertx.core.impl.ConversionHelper.fromJsonObject(elt)).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService updateOne(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.lang.String id, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
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
  public static io.vertx.armysystem.microservice.resource.SoldierService deleteOne(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.deleteOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService change(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.lang.String id, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.change(id,
      item != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(item) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.resource.SoldierService retrieveArchives(io.vertx.armysystem.microservice.resource.SoldierService j_receiver, java.lang.String cardId, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<java.util.Map<String, Object>>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveArchives(cardId,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>>>() {
      public void handle(io.vertx.core.AsyncResult<java.util.List<io.vertx.core.json.JsonObject>> ar) {
        resultHandler.handle(ar.map(event -> event != null ? event.stream().map(elt -> io.vertx.core.impl.ConversionHelper.fromJsonObject(elt)).collect(java.util.stream.Collectors.toList()) : null));
      }
    } : null));
    return j_receiver;
  }
}
