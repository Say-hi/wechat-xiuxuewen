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
        num: 123123,
        id: 1
      },
      observer: function observer(newValue, oldValue, changePath) {
        if (newValue) {
          this._showScroll(newValue);
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
    }
  }
});
//# sourceMappingURL=my-express.js.map
