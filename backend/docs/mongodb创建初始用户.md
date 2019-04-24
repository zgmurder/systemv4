# mongoDB 安全管理:用户登陆

## 新建useradmin用户

    打开mongo.exe，输入命令
    use admin
    db.createUser({
    user:"admin",
    pwd:"topzen123",
    roles: [ { role:"userAdminAnyDatabase",db:"admin" } ]
    })

## 新建trainsystem用户
    use admin
    db.auth('admin', 'topzen123')
    use armysystemv2
    db.createUser({
        user:"armysystemv2",
        pwd:"topzen123",
        roles:["readWrite","dbAdmin"]
    })

##重新启动mongod服务