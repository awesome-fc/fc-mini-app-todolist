## 前言
自 2017 年第一批小程序上线以来，越来越多的移动端应用以小程序的形式呈现。小程序拥有触手可及、用完即走的优点，这大大降低了用户的使用负担，使小程序得到了广泛的传播。在阿里巴巴，小程序也被广泛地应用在淘宝/支付宝/钉钉/高德等平台上。

![](https://data-analysis.cn-shanghai.log.aliyuncs.com/logstores/article-logs/track_ua.gif?APIVersion=0.6.0&title=%E8%BD%BB%E6%9D%BE%E6%9E%84%E5%BB%BA%E5%9F%BA%E4%BA%8E%20Serverless%20%E6%9E%B6%E6%9E%84%E7%9A%84%E5%B0%8F%E7%A8%8B%E5%BA%8F&author=cici&src=article)

为了支撑大量的小程序，服务端面临的挑战有：

* 大量的小程序是不活跃的，传统的至少一台服务器的方式会造成资源浪费；
* 在活动高峰期小程序的调用量激增，要求服务端能够快速进行弹性伸缩。

而小程序开发者往往是客户端/前端的开发者，更多的精力在开发业务代码与应用的快速上线上，而无心顾暇服务端的运维操作。

阿里云 [函数计算](https://statistics.functioncompute.com/?title=%E8%BD%BB%E6%9D%BE%E6%9E%84%E5%BB%BA%E5%9F%BA%E4%BA%8E%20Serverless%20%E6%9E%B6%E6%9E%84%E7%9A%84%E5%B0%8F%E7%A8%8B%E5%BA%8F&author=cici&src=article&url=http%3A%2F%2Ffc.console.aliyun.com%2F%3Ffctraceid%3DYXV0aG9yJTNEY2ljaSUyNnRpdGxlJTNEJUU4JUJEJUJCJUU2JTlEJUJFJUU2JTlFJTg0JUU1JUJCJUJBJUU1JTlGJUJBJUU0JUJBJThFJTIwU2VydmVybGVzcyUyMCVFNiU5RSVCNiVFNiU5RSU4NCVFNyU5QSU4NCVFNSVCMCU4RiVFNyVBOCU4QiVFNSVCQSU4Rg%3D%3D) 是一个全托管 Serverless 计算服务，让开发者无需管理服务器等基础设施，只需编写和上传代码，就能够构建可靠、弹性、安全的服务。

函数计算弹性、免运维、高效、安全的特性十分适合作为小程序的服务端。

## 解决方案
函数计算封装了一套小程序服务端模板，帮助小程序开发者快速搭建基于函数计算的小程序。

使用这个模板搭建小程序应用具有以下特点：
* 运维效率高: 无需管理服务器，部署函数即可上线
* 开发效率高: 基于封装好的数据接口，直接开发业务代码
* 零费用启动: 服务端基于函数计算，数据库采用表格存储，都是按量付费并且有较大的免费额度

### 小程序的工作流程
![搭建流程](https://img.alicdn.com/tfs/TB1zHEEvHj1gK0jSZFuXXcrHpXa-4816-1072.png)
一个完整的支付宝小程序需要以下几个元素：
* 支付宝 App：是支付宝小程序的载体，运行在用户手机端
* 小程序客户端：是小程序展现给用户的操作页面
* 小程序服务端：是小程序的逻辑处理单元，比如对用户进行身份认证以及对数据进行存取
* 支付宝服务端：是支付宝 App 的逻辑处理单元，包含用户的身份信息

函数计算封装了一套小程序服务端模板，帮助小程序开发者快速搭建基于函数计算的小程序。下面介绍服务端模板的工作流程。

### FC 服务端模板工作流程
除了基础设施的运维问题，服务端主要解决两个通用问题：
1. 身份认证: 服务端提供的 API 如何对客户端的请求进行鉴权？客户端的信息如果泄露如何保证数据安全？
2. 数据访问: 客户端如何进行数据库操作和文件操作？

这是每一个小程序开发都会遇到的共性的问题，可以通过一些框架或者模板来避免重复建设。因此我们基于函数计算开发了一个小程序应用模板，解决了这些通用的问题，让开发者能够专注在业务逻辑上，快速开发上线自己的小程序。

![服务端工作流程](https://img.alicdn.com/tfs/TB1QrNjv4v1gK0jSZFFXXb0sXXa-8088-6088.png)
1. 客户端小程序通过支付宝 App 的 API，获得 authCode，这个过程会在 App 中弹出用户授权框；
2. 小程序客户端向小程序服务端发起 createSession 请求，用于初始化的身份认证；
3. 小程序服务端将 authCode 传给支付宝服务端，支付宝服务端校验 authCode，返回 accessToken；
4. 小程序服务端根据收到的 accessToken 生成一个 sessionId 和一个 STS token，在服务端记录这 2 个信息然后把它们返回给客户端。STS token 是用于访问服务端函数的凭证，而 sessionId 作为前面认证成功而建立的会话信息，通过这 个sessionId 可以识别当前请求的用户信息;
5. 小程序客户端再次需要获取数据，带着证明自己身份的 sessionId 向小程序服务端发起获取数据请求；
6. 小程序服务端首先根据 sessionId 获取用户身份信息，再根据用户信息获取相关数据；
7. 将用户数据返回给小程序客户端。


## 搭建流程
### 注册支付宝小程序
* 准备工作：注册支付宝开发者账号
如果您尚未注册支付宝开发者账号，使用支付宝账号登录 [蚂蚁金服开放平台](https://open.alipay.com/platform/home.htm)，并完成开发者身份注册。详细信息请参见 [开发者入驻说明](https://opendocs.alipay.com/mini/introduce/register)。
* 创建支付宝小程序应用
	* 使用支付宝账号登录 [蚂蚁金服开放平台进入开发者中心](https://developers.alipay.com/developmentAccess/developmentAccess.htm) 创建小程序，填写基本信息，并记录下 APPID
	![](https://img.alicdn.com/tfs/TB1VxsJvRr0gK0jSZFnXXbRRXXa-2442-956.png)
    ![APPID](https://img.alicdn.com/tfs/TB10ZEDvHr1gK0jSZR0XXbP8XXa-1812-1176.png)
    *  [生成密钥](https://docs.open.alipay.com/291/106097/)，需要在小程序服务端与支付宝服务端配置密钥，对交易数据进行双方校验
    *  将公钥配置在 【设置】->【开发设置】-【接口加签方式】，并记录私钥
    ![](https://img.alicdn.com/tfs/TB10ZEDvHr1gK0jSZR0XXbP8XXa-1812-1176.png)
    
### 搭建小程序服务端
* 准备工作
	* 开通 [函数计算](https://statistics.functioncompute.com/?title=%E8%BD%BB%E6%9D%BE%E6%9E%84%E5%BB%BA%E5%9F%BA%E4%BA%8E%20Serverless%20%E6%9E%B6%E6%9E%84%E7%9A%84%E5%B0%8F%E7%A8%8B%E5%BA%8F&author=cici&src=article&url=http%3A%2F%2Ffc.console.aliyun.com%2F%3Ffctraceid%3DYXV0aG9yJTNEY2ljaSUyNnRpdGxlJTNEJUU4JUJEJUJCJUU2JTlEJUJFJUU2JTlFJTg0JUU1JUJCJUJBJUU1JTlGJUJBJUU0JUJBJThFJTIwU2VydmVybGVzcyUyMCVFNiU5RSVCNiVFNiU5RSU4NCVFNyU5QSU4NCVFNSVCMCU4RiVFNyVBOCU4QiVFNSVCQSU4Rg%3D%3D)，[表格存储](https://otsnext.console.aliyun.com/)，[日志服务](https://sls.console.aliyun.com/lognext/profile)

* 部署应用
	* 进入控制台应用中心，选择 `Mini App Todo List Server Template` 模板，填写刚才记录的 APPID 与 PrivateKey，为 DBInstance/LogProject 取个自定义的名字（如果名字已被占用，会报 Already Exists 的错误），部署应用


### 搭建小程序客户端
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


由于 [fc-nodejs-sdk](https://github.com/aliyun/fc-nodejs-sdk/tree/mini-app) 使用了ES6语法，在发布小程序时，需要在小程序项目的根目录下，新建一个文件mini.project.json，填入以下内容：

```js
{
  "node_modules_es6_whitelist": [
     "@alicloud/fc2"
  ]
}
``` 

至此，开发工作已经完成，您可以调试，上线您的小程序啦。


## 总结

小程序上线后随着访问量的增加或者活动期间的访问突增，对后端服务的稳定和弹性也是一个很大的考验。函数计算上传代码即可运行，极大地提高了后端服务的开发效率；混合模式的弹性伸缩，轻松应对负载变化。服务端模板与客户端模板可以快速搭建基于函数计算的小程序应用，这些特点使得函数计算成为支撑小程序很好的选择。



