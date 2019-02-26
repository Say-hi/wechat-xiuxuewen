'use strict';

// components/component-tag-name.js
var app = getApp();
Component({
  externalClasses: ['mask', 'mask-in'],
  properties: {
    navData: {
      type: Array,
      value: []
    }
  },
  data: {
    navData: []
  },
  lifetimes: {
    created: function created() {},
    attached: function attached() {
      // 在组件实例进入页面节点树时执行
    },
    ready: function ready() {
      this._getData();
    },
    detached: function detached() {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  methods: {
    upFormId: function upFormId(e) {
      app.upFormId(e);
    },
    _goUrl: function _goUrl(e) {
      app.data.bottomTabIndex = e.currentTarget.dataset.index;
    },
    _getData: function _getData() {
      var that = this;
      var navData = app.gs('bottomNav');
      var currentPage = getCurrentPages();
      var store = false;
      var shop = false;
      console.warn('route', currentPage[currentPage.length - 1].route);
      if (currentPage[currentPage.length - 1].route.indexOf('storePage') >= 0) {
        store = true;
        navData = app.gs('storeBottomNav');
        app.data.bottomTabIndex = currentPage[currentPage.length - 1].route.indexOf('index') >= 0 ? 0 : 1;
      } else if (currentPage[currentPage.length - 1].route.indexOf('shop') >= 0) {
        shop = true;
        navData = app.gs('shopBottomNav');
        switch (currentPage[currentPage.length - 1].route) {
          case 'shopPage/shoppages/index/index':
            app.data.bottomTabIndex = 0;
            break;
          case 'shopCenterPage/shoppages/index/index':
            app.data.bottomTabIndex = 1;
            break;
          case 'shopCarPage/shoppages/car/car':
            app.data.bottomTabIndex = 2;
            break;
          case 'shopUserPage/shoppages/user/user':
            app.data.bottomTabIndex = 3;
            break;
        }
      }
      if (navData) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = navData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            v['active'] = false;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        navData[app.data.bottomTabIndex]['active'] = true;
        that.setData({
          navData: navData
        });
      } else {
        app.wxrequest({
          url: app.getUrl().style,
          data: {
            style: shop ? 5 : store ? 4 : 1
          },
          success: function success(res) {
            wx.hideLoading();
            app.su(shop ? 'shopBottomNav' : store ? 'storeBottomNav' : 'bottomNav', res.data.data);
            res.data.data[app.data.bottomTabIndex]['active'] = true;
            that.setData({
              navData: res.data.data
            });
          }
        });
      }
    }
  }
});
//# sourceMappingURL=my-navigator-tab.js.map
