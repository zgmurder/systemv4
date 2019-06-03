
# 编译
在backend目录下，运行:
```
mvn clean package
```

# 运行微服务
## api-gateway
```json
java -jar .\api-gateway\target\api-gateway-1.0-SNAPSHOT-fat.jar -conf .\api-gateway\src\config\local.json
java -jar .\account-microservice\target\account-microservice-1.0-SNAPSHOT-fat.jar -conf .\account-microservice\src\config\local.json
java -jar .\dictionary-microservice\target\dictionary-microservice-1.0-SNAPSHOT-fat.jar -conf .\dictionary-microservice\src\config\local.json
java -jar .\resource-microservice\target\resource-microservice-1.0-SNAPSHOT-fat.jar -conf .\resource-microservice\src\config\local.json
```
