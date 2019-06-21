package io.vertx.armysystem.microservice.common.service;

import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.streams.ReadStream;
import io.vertx.ext.mongo.*;

import java.util.*;
import java.util.stream.Collectors;

public class MongoRepositoryWrapper {
  protected final MongoClient client;

  public MongoRepositoryWrapper(Vertx vertx, JsonObject config) {
    this.client = MongoClient.createShared(vertx, config);
  }

  public Future<Void> checkDatabase() {
    return this.getCollections().map(r -> null);
  }

  public Future<Optional<JsonObject>> findOne(String collection, JsonObject query, JsonObject fields) {
    Future<Optional<JsonObject>> future = Future.future();
    client.findOne(collection, query, fields,
        ar -> {
          if (ar.succeeded()){
            if (ar.result() == null)
              future.complete(Optional.empty());
            else
              future.complete(Optional.of(ar.result().put("id", ar.result().remove("_id"))));
          } else {
            future.fail(ar.cause());
          }
        });

    return future;
  }

  public Future<List<JsonObject>> findWithOptions(String collection, JsonObject query, JsonObject findOptions) {
    Future<List<JsonObject>> future = Future.future();

    FindOptions options = findOptions == null ? new FindOptions() : new FindOptions(findOptions);

    client.findWithOptions(collection, query, options,
        ar -> {
          if (ar.succeeded())
            future.complete(ar.result().stream()
                .map(json -> json.put("id", json.remove("_id")))
                .collect(Collectors.toList()));
          else
            future.fail(ar.cause());
        });

    return future;
  }

  // 只能插入新的数据
  protected Future<JsonObject> insertOne(String collection, JsonObject document) {
    Future<JsonObject> future = Future.future();
    if (document.getString("id") != null)
      document.put("_id", document.getString("id"));
    if (document.getString("_id") == null) {
      document.put("_id", UUID.randomUUID().toString());
    }
    document.put("createdTime", new Date().getTime());
    document.put("updatedTime", new Date().getTime());
    document.remove("id");

    client.insert(collection, document,
        ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null) {
              document.put("id", ar.result());
            } else {
              document.put("id", document.getString("_id"));
            }
            document.remove("_id");
            future.complete(document);
          }
          else
            future.fail(ar.cause());
        });

    return future;
  }

  protected Future<Void> update(String collection, JsonObject query, JsonObject update) {
    Future<Void> future = Future.future();

    update.put("updatedTime", new Date().getTime());

    client.updateCollection(collection, query, new JsonObject().put("$set", update),
        ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null && ar.result().getDocModified() > 0)
              future.complete();
            else {
              future.fail("Document is not found");
            }
          } else {
            future.fail(ar.cause());
          }
        });

    return future;
  }

  protected Future<Void> removeById(String collection, String id) {
    return remove(collection, new JsonObject().put("_id", id));
  }

  protected Future<Void> remove(String collection, JsonObject query) {
    Future<Void> future = Future.future();

    client.removeDocument(collection, query,
        ar -> {
          if (ar.succeeded()) {
            if (ar.result() != null && ar.result().getRemovedCount() > 0)
              future.complete();
            else
              future.fail("Document is not found");
          } else {
            future.fail(ar.cause());
          }
        });

    return future;
  }

  protected Future<Long> count(String collection, JsonObject query) {
    Future<Long> future = Future.future();

    client.count(collection, query, ar -> {
      if (ar.succeeded()) {
        future.complete(ar.result());
      } else {
        future.fail(ar.cause());
      }
    });

    return future;
  }

  protected Future<List<JsonObject>> bulkWrite(String collection, List<BulkOperation> operations) {
    Future<List<JsonObject>> future = Future.future();

    client.bulkWrite(collection, operations, ar -> {
      if (ar.succeeded()) {
        future.complete(ar.result().getUpserts());
      } else {
        future.fail(ar.cause());
      }
    });

    return future;
  }

  public ReadStream<JsonObject> aggregateWithOptions(String collection, final JsonArray pipeline, JsonObject options) {
    return client.aggregateWithOptions(collection, pipeline, new AggregateOptions(options));
  }

  public Future<List<JsonObject>> aggregateQuery(String collection, final JsonArray pipeline, JsonObject options) {
    List<JsonObject> results = new ArrayList<>();
    Future<List<JsonObject>> future = Future.future();
    options.put("batchSize", 200)
        .put("maxTime", 5000)
        .put("maxAwaitTime", 5000);
    client.aggregateWithOptions(collection, pipeline, new AggregateOptions(options))
        .handler(object -> results.add(object))
        .endHandler(v -> future.complete(results))
        .exceptionHandler(ex -> future.fail(ex));

    return future;
  }

  protected Future<Void> createCollection(String collectionName) {
    Future<Void> future = Future.future();

    client.createCollection(collectionName, ar -> {
      if (ar.succeeded()) {
        future.complete();
      } else {
        future.fail(ar.cause());
      }
    });

    return future;
  }

  protected Future<List<String>> getCollections() {
    Future<List<String>> future = Future.future();

//    client.getCollections(future.completer());
    client.getCollections(
        ar -> {
          if (ar.succeeded()) {
            System.out.println("Collections: " + ar.result());
            future.complete(ar.result());
          } else {
            future.fail(ar.cause());
          }
        });

    return future;
  }

  protected Future<Boolean> isCollectionExisted(String collectionName) {
    Future<Boolean> future = Future.future();

    this.getCollections()
        .map(collections -> collections.stream().filter(c -> c.equals(collectionName)).count())
        .setHandler(ar -> {
          if (ar.succeeded()) {
            if (ar.result() > 0) {
              future.complete(true);
            } else {
              future.complete(false);
            }
          } else {
            future.fail(ar.cause());
          }
        });

    return future;
  }

  protected Future<Void> dropCollection(String collectionName) {
    Future<Void> future = Future.future();

    client.dropCollection(collectionName, ar -> {
      if (ar.succeeded()) {
        future.complete();
      } else {
        future.fail(ar.cause());
      }
    });

    return future;
  }

  protected Future<Void> createIndexWithOptions(String collectionName, JsonObject key, JsonObject indexOptions) {
    Future<Void> future = Future.future();

    client.createIndexWithOptions(collectionName, key, new IndexOptions(indexOptions), ar -> {
      if (ar.succeeded()) {
        future.complete();
      } else {
        future.fail(ar.cause());
      }
    });

    return future;
  }
}
