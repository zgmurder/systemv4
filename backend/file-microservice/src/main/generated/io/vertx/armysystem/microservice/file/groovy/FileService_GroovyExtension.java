package io.vertx.armysystem.microservice.file.groovy;
public class FileService_GroovyExtension {
  public static io.vertx.armysystem.microservice.file.FileService addOne(io.vertx.armysystem.microservice.file.FileService j_receiver, java.util.Map<String, Object> item, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.addOne(item != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(item) : null,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.file.FileService retrieveOne(io.vertx.armysystem.microservice.file.FileService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.util.Map<String, Object>>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.retrieveOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject>>() {
      public void handle(io.vertx.core.AsyncResult<io.vertx.core.json.JsonObject> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromJsonObject(event)));
      }
    } : null));
    return j_receiver;
  }
  public static io.vertx.armysystem.microservice.file.FileService deleteOne(io.vertx.armysystem.microservice.file.FileService j_receiver, java.lang.String id, java.util.Map<String, Object> principal, io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>> resultHandler) {
    io.vertx.core.impl.ConversionHelper.fromObject(j_receiver.deleteOne(id,
      principal != null ? io.vertx.core.impl.ConversionHelper.toJsonObject(principal) : null,
      resultHandler != null ? new io.vertx.core.Handler<io.vertx.core.AsyncResult<java.lang.Void>>() {
      public void handle(io.vertx.core.AsyncResult<java.lang.Void> ar) {
        resultHandler.handle(ar.map(event -> io.vertx.core.impl.ConversionHelper.fromObject(event)));
      }
    } : null));
    return j_receiver;
  }
}
