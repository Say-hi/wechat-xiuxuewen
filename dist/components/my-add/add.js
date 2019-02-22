'use strict';

/*eslint-disable */
var app = getApp();
Component({
  data: {},
  ready: function ready() {},

  lifetimes: {
    attached: function attached() {
      var _this = this;

      if (app.gs('first') >= 1) {
        return this.setData({
          noshow: true
        });
      }
      setTimeout(function () {
        _this.setData({
          show: true
        });
      }, 200);
      // 在组件实例进入页面节点树时执行
    },
    detached: function detached() {
      // 在组件实例被从页面节点树移除时执行
    }
  }
});
//# sourceMappingURL=add.js.map
