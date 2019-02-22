'use strict';

// components/component-tag-name.js
var app = getApp();
Component({
  properties: {
    propUser: {
      type: Object,
      value: {
        user_id: '默认用户',
        obj_id: -1,
        type: 'video',
        index: -1
      },
      observer: function observer(newValue, oldValue, changePath) {}
    }
  },
  data: {
    statusBarHeight: app.data.statusBarHeight,
    HEIGHT: app.data.HEIGHT_TOP
  },
  created: function created() {},

  methods: {
    _back: function _back() {
      wx.navigateBack();
    }
  }
});
//# sourceMappingURL=my-top-tab.js.map
