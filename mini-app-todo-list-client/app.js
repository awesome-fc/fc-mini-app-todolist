const Server = require('./server');

App({
  todos: [],
  originTodos: [
    { text: '开通 FC', completed: true },
    { text: '开发第一个函数', completed: true },
    { text: '部署应用上线', completed: false },
  ],
  userInfo: null,
  initialized: false,
  server: Server,

  getUserInfo() {
    return new Promise((resolve, reject) => {
      console.log('begin to get user info');
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          console.info(authcode);
          my.getAuthUserInfo({
            success: res => {
              this.userInfo = res;
              this.server.init(authcode, (err) => {
                if (err) { return reject(err); }
                resolve(this.userInfo);
              });
            },
            fail: (err) => {
              reject(err);
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },

  persist(arr) {
    var server = this.server
    arr.forEach(function (item, index, array) {
      server.db('put', {
        obj: {
          id: item.text,
          completed: item.completed,
        }
      })

    })
  },

  sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
  },

  app_init() {
    var app = this
    var resp = []
    return new Promise((resolve, reject) => {
      console.log('step into app init')
      app.getUserInfo().then(
        function () {
          app.server.db('list', {}, (err, res) => {
            console.log('start to list')
            var todos = res.data.data.map(item => {
              console.log('item.completed === true', item.completed)
              return { text: item.id, completed: item.completed === 'true' };
            });
            if (todos.length > 0) {
              app.todos = todos
              resolve(todos)
            } else {
              app.todos = app.originTodos
              resolve(app.originTodos)
            }
          })
        },
      );
    })
  }
});