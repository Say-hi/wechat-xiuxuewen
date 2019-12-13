"use strict";

// components/component-tag-name.js
var app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    propObj: {
      type: Object,
      value: {
        out_trade_no: 123123,
        order_num: 1
      },
      observer: function observer(newValue, oldValue, changePath) {
        if (newValue) {
          this._getData(newValue.out_trade_no, newValue.order_num);
        }
      }
    }
  },
  data: {},
  methods: {
    _showScroll: function _showScroll() {
      this.setData({
        showS: !this.data.showS
      });
    },
    _getData: function _getData(one, two) {
      var that = this;
      app.wxrequest({
        url: app.getUrl().userLogistic,
        data: {
          out_trade_no: one,
          order_num: two
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            that.setData({
              express: res.data.data.data,
              showS: true
            });
          } else {
            that.setData({
              showS: false
            });
            app.setToast(getCurrentPages()[getCurrentPages().length - 1], { content: res.data.desc });
          }
        }
      });
    }
  }
});