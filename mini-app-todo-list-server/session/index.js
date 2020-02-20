const fs = require('fs');
const getRawBody = require('raw-body');
const TableStore = require('tablestore');
const AlipaySdk = require('alipay-sdk').default;
const PopCore = require('@alicloud/pop-core');
const uuidv4 = require('uuid/v4');

var CLIENT, TABLE, APPID;

exports.handler = async (req, resp, ctx) => {
  if (CLIENT == null) {
    TABLE = process.env.sessionTableName;
    APPID = process.env.appId;
    PrivateKey = process.env.privateKey;
    CLIENT = newClient(ctx);
  }

  try {
    var body = await getRawBody(req);
    var evt = JSON.parse(body.toString());
    console.log('event: ', evt);

    const alipaySdk = new AlipaySdk({
      appId: APPID,
      privateKey: PrivateKey,
    });

    if (!evt.authCode) {
      throw new Error('authCode required');
    }

    const authInfo = await alipaySdk.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code: evt.authCode,
    });
    console.log('authInfo: %o', authInfo);

    const sessionId = await createSession(authInfo);
    const sts = await assumeRole(ctx, sessionId);

    resp.send(JSON.stringify({
      sessionId: sessionId,
      sts: sts,
    }));
  } catch (err) {
    console.error('error: ', err);
    resp.send(err.toString());
  }
};

function newClient(ctx) {
  var instanceName = process.env.instanceName;
  // default to public endpoint for local test
  var endpoint = `https://${instanceName}.${ctx.region}.ots.aliyuncs.com`;
  // change to internal endpoint in cloud env
  
  return new TableStore.Client({
    accessKeyId: ctx.credentials.accessKeyId,
    secretAccessKey: ctx.credentials.accessKeySecret,
    securityToken: ctx.credentials.securityToken,
    endpoint: endpoint,
    instancename: instanceName,
  });
}

async function createSession(authInfo) {
  const sessionId = uuidv4();

  var params = {
    tableName: TABLE,
    primaryKey: [{ 'id': sessionId }],
    condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
    attributeColumns: Object.keys(authInfo).map((k) => {
      var x = {};
      x[k] = authInfo[k];
      return x;
    }),
    returnContent: { returnType: TableStore.ReturnType.Primarykey }
  };
  console.log('put: %o', params);
  await CLIENT.putRow(params);

  return sessionId;
}

async function assumeRole(ctx, sessionId) {
  const roleArn = process.env.stsRoleArn;
        
  var client = new PopCore({
    accessKeyId: ctx.credentials.accessKeyId,
    secretAccessKey: ctx.credentials.accessKeySecret,
    securityToken: ctx.credentials.securityToken,
    endpoint: 'https://sts.aliyuncs.com',
    apiVersion: '2015-04-01'
  });

  var params = {
    'RoleArn': roleArn,
    'RoleSessionName': sessionId.substr(0, 32),
    'DurationSeconds': 900,
    'Policy': JSON.stringify({
      'Version': '1',
      'Statement': [
        {
          'Action': 'fc:InvokeFunction',
          'Resource': [
            `acs:fc:*:*:services/${ctx.service.name}/functions/*`,
            `acs:fc:*:*:services/${ctx.service.name}.LATEST/functions/*`,
          ],
          'Effect': 'Allow',
        },
      ],
    }),
  };

  const sts = await client.request('AssumeRole', params);
  console.log('sts: %o', sts);

  return sts.Credentials;
}
