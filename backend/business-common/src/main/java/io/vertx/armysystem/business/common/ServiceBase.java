package io.vertx.armysystem.business.common;

public interface ServiceBase {
  String getServiceName();

  String getServiceAddress();

  String getPermission();

  String getCollectionName();
}
