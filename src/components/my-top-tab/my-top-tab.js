// components/component-tag-name.js
const app = getApp()
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
      observer (newValue, oldValue, changePath) {

      }
    }
  },
  data: {
    statusBarHeight: app.data.statusBarHeight,
    HEIGHT: app.data.HEIGHT_TOP
  },
  created () {

  },
  methods: {
    _back () {
      wx.navigateBack()
    }
  }
})
