package io.vertx.armysystem.microservice.account.common;

import io.vertx.armysystem.business.common.CRUDService;
import io.vertx.armysystem.microservice.account.Role;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public final class Functional {

  private Functional() {
  }

  public static Future<List<String>> getPermissitions(String roleName, CRUDService roleService) {
    Future<List<String>> future = Future.future();

    List<String> permissions = new ArrayList<>();
    if (roleName != null) {
      roleService.retrieveOne(roleName, new JsonObject(),
          ar -> {
            if (ar.succeeded()) {
              if (ar.result() != null) {
                new Role(ar.result()).getPermissions().forEach(perm -> {
                  perm.getActions().forEach(action -> {
                    permissions.add(perm.getSchemaName() + ":" + action);
                  });
                });
                future.complete(permissions);
              } else {
                future.fail("The role " + roleName + " does not exist.");
              }
            } else {
              future.fail(ar.cause());
            }
          });
    } else {
      System.out.println("***** roleName is null");
      future.fail("The role should not be empty.");
    }

    return future;
  }
}
