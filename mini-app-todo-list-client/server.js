const util = require('util');
const FClient = require('@alicloud/fc2');

const fcAccountId = '1671011226853360';
const fcRegion = 'cn-hangzhou';
const fcServiceName = 'todo-list4-todo-list-svc-6ED644ABFC05';
const sessionFunctionName = 'todo-list4-session-51E58506D625';
const dbFunctionName = 'todo-list4-db-7A9F31268853';
const sessionEndpoint = util.format('https://%s.%s.fc.aliyuncs.com/2016-08-15/proxy/%s/%s/',
                                    fcAccountId, fcRegion, fcServiceName, sessionFunctionName);

module.exports = {
  sessionId: null,
  fcClient: null,

  init: (authCode, cb) => {
    console.log('step into init')
    my.request({
      url: sessionEndpoint,
      method: 'POST',
      data: authCode,
      dataType: 'json',
      success: (resp) => {
        console.log('session succ: ', resp);
        var session = resp.data;
        module.exports.fcClient = new FClient(fcAccountId, {
          accessKeyID: session.sts.AccessKeyId,
          accessKeySecret: session.sts.AccessKeySecret,
          securityToken: session.sts.SecurityToken,
          region: fcRegion,
          secure: true,
          timeout: 10000 // Request timeout in milliseconds, default is 10s
        });
        module.exports.sessionId = session.sessionId;
        cb();
      },
      
      fail: 
       cb,
    });
  },

  db: (op, data, cb) => {
    if (module.exports.fcClient == null) {
      return;
    }
    var event = {sid: module.exports.sessionId, op: op};
    Object.assign(event, data || {});
    module.exports.fcClient.invokeFunction(fcServiceName, dbFunctionName, JSON.stringify(event)).then((res) => {
      console.info('invoke, op: %o, data: %o, res: %o', op, data, res);
      if (cb) { cb(null, res); }
    }).catch((err) => {
      console.error('invoke, op: %o, data: %o, err: %o', op, data, err);
      if (cb) { cb(err); }
    });
  },
};