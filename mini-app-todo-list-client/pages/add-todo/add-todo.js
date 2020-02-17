const app = getApp();

Page({
  data: {
    inputValue: '',
  },

  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  add() {
    app.todos = app.todos.concat([
      {
        text: this.data.inputValue,
        compeleted: false,
      },
    ]);
    app.server.db('put', {obj:{
        id: this.data.inputValue,
        completed: false,
      }})

    my.navigateBack({ url: '../add-todo/todos' });
  },
});
