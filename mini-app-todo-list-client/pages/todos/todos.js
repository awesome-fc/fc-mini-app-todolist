// 获取全局 app 实例
const app = getApp();

Page({
  // 声明页面数据
  data: {},
  // 监听生命周期回调 onLoad
  onLoad() {
    // 获取用户信息并存储数据
    app.getUserInfo().then(
      user => {
        this.setData({
          user,
        })
      },
      () => {
        // 获取用户信息失败
      },
    );
  },
  // 监听生命周期回调 onShow
  onShow() {
    if (!app.initialized) {
      app.getUserInfo().then(
        user => {
          app.server.db('list', {}, (err, res) => {
            var todos = res.data.data.map(item => {
              return { text: item.id, completed: item.completed };
            });
            if (todos.length > 0) {
              app.todos = todos
            } else {
              app.todos = app.originTodos
              app.persist(app.todos)

            }
            app.initialized = true
            this.setData({ todos: app.todos });

          })
        })
    } else {
      this.setData({ todos: app.todos });

    }
  },
  // 事件处理函数
  onTodoChanged(e) {
    // 修改全局数据
    const checkedTodos = e.detail.value;
    app.todos = app.todos.map(todo => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.text) > -1,

    }));
    app.persist(app.todos)
    this.setData({ todos: app.todos });
  },

  addTodo() {
    // 进行页面跳转
    my.navigateTo({ url: '../add-todo/add-todo' });
  },
});
