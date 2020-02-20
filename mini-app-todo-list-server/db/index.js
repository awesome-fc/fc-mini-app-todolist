'use strict';

const TableStoreDB = require('./tablestore.js');

var TODO_DB, SESSION_DB;

exports.handler = async (event, ctx, callback) => {
  console.log('event: %s', event.toString());

  if (TODO_DB == null) {
    TODO_DB = new TableStoreDB(ctx, process.env.tableName);
    SESSION_DB = new TableStoreDB(ctx, process.env.sessionTableName);
  }
  try {
    var evt = JSON.parse(event.toString());
    const uid = await getUid(evt.sid);
    var resp;

    switch (evt.op) {
      case 'put':
        await TODO_DB.put(uid, evt.obj);
        break;
      case 'get':
        resp = await TODO_DB.get(uid, evt.id);
        break;
      case 'list':
        resp = await TODO_DB.list(uid);
        break;
      case 'remove':
        await TODO_DB.remove(uid, evt.id);
        break;
      default:
        throw new Error(`invalid op: ${evt.op}`);
    }
    callback(null, {'data': resp});
  } catch (err) {
    console.log('error: ', err);
    callback(err);
  }
};

async function getUid(sid) {
  var obj = await SESSION_DB.rawGet([{'id': sid}]);
  return obj.userId;
}
