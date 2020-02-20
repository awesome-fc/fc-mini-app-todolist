## 概述
此工程为函数计算提供的 [小程序服务端模板](https://fc.console.aliyun.com/fc/applications/cn-hangzhou/template/mini-app-todo-list-server-template#intro) 源码，您可以通过函数计算控制台按照以下步骤直接部署。


## 应用简介
![](https://img.alicdn.com/tfs/TB1xkpHvRr0gK0jSZFnXXbRRXXa-366-649.gif)


基于 [函数计算](http://fc.console.aliyun.com/) 和 [表格存储](http://ots.console.aliyun.com/) 的小程序服务端模板，解决了身份认证和数据访问等通用问题，让开发者能够专注在业务逻辑上，快速开发上线自己的小程序。

搭建完整的支付宝小程序需要同时 [在支付宝平台注册小程序](https://opendocs.alipay.com/mini/introduce/create)，[开发小程序客户端](https://opendocs.alipay.com/mini/developer)，[开发小程序服务端](https://opendocs.alipay.com/mini/developer/todo-backend-overview)，本模板仅为小程序服务端模板。

使用这个模板搭建小程序应用具有以下特点：

1. 运维效率高: 无需管理服务器，部署函数即可上线
2. 开发效率高: 基于封装好的数据接口，直接开发业务代码
3. 0 费用启动: 服务端基于函数计算，数据库采用表格存储，都是按量付费并且有较大的免费额度

## 调用方式

部署成功后，会生成一个 session 的 URL:

![image.png](https://img.alicdn.com/tfs/TB1svpHvebviK0jSZFNXXaApXXa-1586-1114.png)

可以向生成的 URL 发 POST 请求测试一下是否部署成功：

```sh
$ curl -X POST https://<accountID>.<region>.fc.aliyuncs.com/2016-08-15/proxy/<serviceName>/<functionName>/ -d '{}' 
```

如果收到 "authCode required"，则表明服务端部署成功。

### 客户端调用方式
部署成功后，会输出5个参数(AccountId, Region, ServiceName, SessionFunctionName, DBFunctionName)，把它们配置在 [小程序客户端项目](https://github.com/awesome-fc/fc-mini-app-todolist/tree/master/mini-app-todo-list-client) 中，客户端就能访问我们部署的服务了。

## 工作原理

客户端和服务端的交互流程如下：

![image.png](https://img.alicdn.com/tfs/TB1QrNjv4v1gK0jSZFFXXb0sXXa-8088-6088.png)

其中 1-4 步只需要在首次认证的时间执行，5-7 步是后续访问数据的时候执行。

数据表结构:

|uid(pk)|id(pk)|col1   |col2  |col3     |...      |
|-------|------|-------|------|---------|---------|
|uid1   |id1   |val11  |val12 |val13    |...      |
|uid1   |id2   |val21  |val22 |val23    |...      |
|uid2   |id3   |val31  |val32 |val33    |...      |

Session表结构:

|id(pk) |userId |col2  |col3     |...      |
|-------|-------|------|---------|---------|
|sid1   |uid1   |val12 |val13    |...      |
|sid2   |uid2   |val22 |val23    |...      |
|sid3   |uid3   |val32 |val33    |...      |
