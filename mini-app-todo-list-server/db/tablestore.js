'use strict';

// db backed by TableStore
// table schema:
//
// |uid(pk)|id(pk)|col1   |col2  |col3     |...      |
// |-------|------|-------|------|---------|---------|
// |uid1   |id1   |val11  |val12 |val13    |...      |
// |uid1   |id2   |val21  |val22 |val23    |...      |
// |uid2   |id3   |val31  |val32 |val33    |...      |
//
// pk1   = uid
// pk2   = id
// cols  = key-value

const TableStore = require('tablestore');

class TableStoreDB {
  constructor(ctx, tableName) {
    this.client = newClient(ctx);
    this.tableName = tableName;
  }

  async put(uid, obj) {
    var params = {
      tableName: this.tableName,
      primaryKey: [{ 'uid': uid }, { 'id': obj.id }],
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      attributeColumns: Object.keys(obj).filter(k => k != 'id').map((k) => {
        var x = {};
        x[k] = obj[k];
        return x;
      }),
      returnContent: { returnType: TableStore.ReturnType.Primarykey }
    };
    console.log('put: ', params);
    await this.client.putRow(params);
  }

  async get(uid, id) {
    return this.rawGet([{ 'uid': uid }, { 'id': id }])
  }

  async list(uid) {
    var params = {
      tableName: this.tableName,
      direction: TableStore.Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: [{ "uid": uid }, { "id": TableStore.INF_MIN }],
      exclusiveEndPrimaryKey: [{ "uid": uid }, { "id": TableStore.INF_MAX }],
      limit: 10,
    };
    console.log('list: ', params);
    var resp = await this.client.getRange(params);
    return resp.rows.map((item) => {
      return rowToObj(item);
    });
  }

  async remove(uid, id) {
    var params = {
      tableName: this.tableName,
      primaryKey: [{ 'uid': uid }, { 'id': id }],
    };
    console.log('remove: ', params);
    await this.client.deleteRow(params);
  }

  async rawGet(pk) {
    var params = {
      tableName: this.tableName,
      primaryKey: pk,
    };
    console.log('get: ', params);
    var resp = await this.client.getRow(params);
    return rowToObj(resp.row);
  }
};

module.exports = TableStoreDB;

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
};

function rowToObj(row) {
  var obj = {};
  row.primaryKey.forEach((item) => {
    obj[item.name] = item.value;
  });

  row.attributes.forEach((item) => {
    obj[item.columnName] = item.columnValue;
  });
  return obj;
}
