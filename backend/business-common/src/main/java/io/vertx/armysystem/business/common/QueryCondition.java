package io.vertx.armysystem.business.common;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class QueryCondition {
  private String organizationId;
  private JsonObject query;
  private JsonObject option;

  public JsonObject getQuery() {
    return query;
  }

  public JsonObject getOption() {
    return option;
  }

  public QueryCondition() {
    this.organizationId = null;
    this.query = new JsonObject();
    this.option = new JsonObject();
  }

  public QueryCondition(JsonObject query, JsonObject option) {
    this.organizationId = null;
    this.query = query;
    this.option = option;
  }

  public QueryCondition(String organizationId, JsonObject query, JsonObject option) {
    this.organizationId = organizationId;
    this.query = query;
    this.option = option;
  }

  public static QueryCondition parse(JsonObject body) {
    System.out.println("QueryCondition::parse " + body);
    if (body == null) body = new JsonObject();

    String organizationId = body.getString("organizationId");
    JsonObject query = body.getJsonObject("where");
    JsonObject option = body.getJsonObject("option");
    if (query == null) query = new JsonObject();
    if (option == null) option = new JsonObject();
    if (!option.containsKey("limit")) {
      option.put("limit", 20);
    }
    if (!option.containsKey("skip")) {
      option.put("skip", 0);
    }

    return new QueryCondition(organizationId, query, option).convertId();
  }

  /**
   * Filter collection records by login user's organizationId
   *
   * @param columnName  the organization parentIds' column name
   * @param principal   the user principal
   * @return the new mongodb query object
   */
  public QueryCondition filterByUserOrganizationV1(String columnName, JsonObject principal) {
    if (principal.containsKey("organizationId")) {
      query.put(columnName, new JsonObject().put("$eq", principal.getString("organizationId")));
    }

    return this;
  }

  /**
   * Filter collection records by login user's organizationId with $and operator.
   *
   * @param columnName  the organization parentIds' column name
   * @param principal   the user principal
   * @return the new mongodb query object
   */
  public QueryCondition filterByUserOrganizationV2(String columnName, JsonObject principal) {
    if (principal.getString("organizationId") != null) {
      if (query.isEmpty()) {
        query.put(columnName, new JsonObject().put("$eq", principal.getString("organizationId")));
      } else {
        this.query = new JsonObject()
            .put("$and", new JsonArray()
                .add(query)
                .add(new JsonObject()
                    .put(columnName, new JsonObject().put("$eq", principal.getString("organizationId")))));
      }
    }

    return this;
  }

  protected QueryCondition convertId() {
    this.convertIdReverse(this.query);

    return this;
  }

  private void convertIdReverse(JsonObject query) {
    if (query.containsKey("id")) {
      query.put("_id", query.getValue("id"));
      query.remove("id");
    }

    query.stream()
        .filter(r -> r.getValue().getClass() == JsonObject.class)
        .forEach(r -> convertIdReverse((JsonObject)r.getValue()));
  }

  @Override
  public String toString() {
    return query.toString() + "\n" + option.toString();
  }
}
