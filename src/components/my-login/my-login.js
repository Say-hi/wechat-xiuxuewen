// components/component-tag-name.js
const app = getApp()
Component({
  data: {
    login_bg: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
  },
  ready () {
    if (!app.gs()) {
      this.setData({
        show: true
      })
    }
  },
  methods: {
    MaskGetUserInfo (e) {
      if (e.detail.iv) {
        wx.showLoading({
          title: '刷新数据中...'
        })
        app.wxlogin()
      }
    }
  }
})
