'use strict';

/*eslint-disable */
Component({
  properties: {
    propShow: {
      type: Number,
      observer: function observer(newValue, oldValue, changePath) {
        if (newValue > 1) {
          console.log('newValue', newValue);
          this._show();
        }
      }
    }
  },
  options: {
    addGlobalClass: true
  },
  data: {
    show: 2
  },
  ready: function ready() {},

  methods: {
    _back: function _back() {
      if (getCurrentPages().length >= 2) {
        wx.navigateBack();
      } else {
        wx.reLaunch({
          url: '/pingPage/pingpages/index/index'
        });
      }
    },
    _close: function _close() {
      this.setData({
        show: 2
      });
    },
    _show: function _show() {
      this.setData({
        show: 1
      });
    }
  },
  pageLifetimes: {
    show: function show() {
      this.setData({
        move: !this.data.move
      });
    },
    hide: function hide() {
      this.setData({
        move: !this.data.move
      });
    }
  }
});