## 概述

Todos用来演示如何使用小程序来实现一个简单的任务管理。

## 使用
* 准备工作
	* 下载并安装支付宝 [小程序开发者工具](https://opendocs.alipay.com/mini/ide/download)。

* 搭建应用
	* 在小程序项目根目录下，安装 [fc-nodejs-sdk](https://github.com/aliyun/fc-nodejs-sdk/tree/mini-app):
	
    ```
    npm install git://github.com/aliyun/fc-nodejs-sdk.git#mini-app --save
    ```
    
    * TODO LIST 客户端代码在 [mini-app-todo-list-client](https://github.com/awesome-fc/fc-mini-app-todolist/tree/master/mini-app-todo-list-client)
    	* 修改server.js开头定义的变量，这些值会在 [服务端模板](http://gitlab.alibaba-inc.com/awesome-fc/mini-app-todo-list-server) 部署成功后自动输出：
    	
|信息|说明|
|----|----|
|fcAccountId|阿里云AccountId|
|fcRegion|函数部署的区域，例如`cn-shanghai`|
|fcServiceName|函数计算服务名称|
|sessionFunctionName|session函数的名称，例如session|
|dbFunctionName|db函数的名称，例如db|

您就可以基于此客户端模板继续开发小程序应用了。

## 资源
1. 真机预览需要扫码登录并选中关联应用，[请点击这里查看详情](https://docs.alipay.com/mini/ide/overview) 
2. 如果您对框架还不太熟悉，[请参考帮助文档](https://docs.alipay.com/mini/framework/overview)
3. 如果您要上传发布小程序， [这里有详细步骤](https://docs.alipay.com/mini/developer/getting-started)