package io.vertx.armysystem.microservice.account.common;

import io.vertx.core.Future;
import io.vertx.armysystem.microservice.account.RoleService;

import java.util.ArrayList;
import java.util.List;

public final class Functional {

  private Functional() {
  }

  public static Future<List<String>> getPermissitions(String roleName, RoleService roleService) {
    Future<List<String>> future = Future.future();

    List<String> permissions = new ArrayList<>();
    if (roleName != null) {
      roleService.retrieveByRoleName(roleName,
          ar -> {
            if (ar.succeeded()) {
              if (ar.result() != null) {
                ar.result().getPermissions().forEach(perm -> {
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
