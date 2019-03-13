
## 安装依赖

```
npm install
```

## 启动服务

```
npm start
```

## 使用 pm2 管理服务

修改 pm2.json 中的 cwd 字段改为真实的项目路径，然后在项目目录下使用下面的命令来启动/重启服务：
```
pm2 startOrReload pm2.json
```

cnpm i node-schedule base64-img fs-extra jsonwebtoken