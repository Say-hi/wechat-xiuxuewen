"use strict";

/*eslint-disable */
Component({
  properties: {},
  options: {
    addGlobalClass: true
  },
  data: {},
  ready: function ready() {},

  methods: {},
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