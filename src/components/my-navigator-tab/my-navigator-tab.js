// components/component-tag-name.js
const app = getApp()
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
    created () {

    },
    attached () {
      // 在组件实例进入页面节点树时执行
    },
    ready () {
      this._getData()
    },
    detached () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  methods: {
    _goUrl (e) {
      app.data.bottomTabIndex = e.currentTarget.dataset.index
    },
    _getData () {
      let that = this
      let navData = app.gs('bottomNav')
      if (navData) {
        for (let v of navData) {
          v['active'] = false
        }
        navData[app.data.bottomTabIndex]['active'] = true
        that.setData({
          navData
        })
      } else {
        app.wxrequest({
          url: app.getUrl().style,
          data: {
            style: 1
          },
          success (res) {
            wx.hideLoading()
            app.su('bottomNav', res.data.data)
            res.data.data[app.data.bottomTabIndex]['active'] = true
            that.setData({
              navData: res.data.data
            })
          }
        })
      }
    }
  }
})
