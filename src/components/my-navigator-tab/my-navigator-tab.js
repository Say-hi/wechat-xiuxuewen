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
    navData: [],
    all_Screen: app.data.all_screen
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
    upFormId (e) {
      app.upFormId(e)
    },
    _goUrl (e) {
      app.data.bottomTabIndex = e.currentTarget.dataset.index
    },
    _getData () {
      let that = this
      let navData = app.gs('bottomNav')
      let currentPage = getCurrentPages()
      let store = false
      let shop = false
      if (currentPage[currentPage.length - 1].route.indexOf('storePage') >= 0) {
        store = true
        navData = app.gs('storeBottomNav')
        app.data.bottomTabIndex = currentPage[currentPage.length - 1].route.indexOf('index') >= 0 ? 0 : 1
      } else if (currentPage[currentPage.length - 1].route.indexOf('shop') >= 0) {
        shop = true
        navData = app.gs('shopBottomNav')
        switch (currentPage[currentPage.length - 1].route) {
          case 'shopPage/shoppages/index/index':
            app.data.bottomTabIndex = 1
            break
          case 'shopCenterPage/shoppages/index/index':
            app.data.bottomTabIndex = 99
            break
          case 'shopCarPage/shoppages/car/car':
            app.data.bottomTabIndex = 2
            break
          case 'shopUserPage/shoppages/user/user':
            app.data.bottomTabIndex = 3
            break
        }
      }
      if (navData) {
        for (let v of navData) {
          v['active'] = false
        }
        if (app.data.bottomTabIndex < 10) navData[app.data.bottomTabIndex]['active'] = true
        app.setBar(navData[app.data.bottomTabIndex]['title'])
        that.setData({
          navData
        })
      } else {
        app.wxrequest({
          url: app.getUrl().style,
          data: {
            style: shop ? 5 : store ? 4 : 1
          },
          success (res) {
            wx.hideLoading()
            app.su(shop ? 'shopBottomNav' : store ? 'storeBottomNav' : 'bottomNav', res.data.data)
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
