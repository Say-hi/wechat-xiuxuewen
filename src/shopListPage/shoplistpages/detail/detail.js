// 获取全局应用程序实例对象
const app = getApp()
console.log(app.data.all_Screen)
let startX = 0
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    in_area: true,
    buy_type: 'normal',
    ngshow: 1,
    enable_progress_gesture: true,
    systemVersion: app.data.systemVersion,
    num: 1,
    labelIndex: 0,
    all_Screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  // videotouchstart (e) {
  //   console.log(e)
  //   startX = e.changedTouches[0].clientX
  // },
  // videotouchend (e) {
  //   console.log(e)
  //   if (startX - e.changedTouches[0].clientX >= 30) {
  //     console.log(1)
  //     this.setData({
  //       current: 1
  //     })
  //   }
  // },
  showImg (e) {
    wx.previewImage({
      urls: this.data.info.detail,
      current: this.data.info.detail[e.currentTarget.dataset.index]
    })
  },
  goSubmit () {
    if (this.data.num > this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, {content: '该产品已无库存'})
    if (this.data.addCar) { // 添加到购物车
      let that = this
      return app.wxrequest({
        url: app.getUrl().shopCartAdd,
        data: Object.assign({
          uid: app.gs('userInfoAll').id,
          mid: that.data.info.mid,
          count: that.data.num,
          sku_id: that.data.info.sku[that.data.labelIndex].id,
          pid: that.data.info.id
        }),
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            wx.showToast({
              title: '添加成功'
            })
            that.setData({
              num: 1,
              buyMask: that.data.info.label * 1 !== -1
            })
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      })
    }
    let { img, title, label, sku, freight, id, people = 2 } = this.data.info // 直接购买
    app.su('buyInfo', [{  // 产品信息缓存
      id,
      img,
      title,
      label,
      freight,
      people,
      sku: sku[this.data.labelIndex],
      count: this.data.num,
    }])
    if (this.data.ping && this.data.buy_type === 'ping') {
      return wx.redirectTo({
        url: '../submit/submit?type=now&ping=ping'
      })
    }
    wx.redirectTo({
      url: '../submit/submit?type=now'
    })
  },
  sptChange () {
    this.setData({
      showPingTeam: !this.data.showPingTeam
    })
  },
  buy (e) {
    if (this.data.ping) { // 拼团检查是否在区域内合法
      if (!this.data.in_area) { // 购买非法
        return this.setData({
          ngshow: ++this.data.ngshow
        })
      }
      if (e.currentTarget.dataset.type === 'ping') { // 发起拼团
        this.data.buy_type = 'ping'
      } else {  // 拼团直接购买
        this.data.buy_type = 'normal'
      }
      this.setData({ // 规则选择
        buyMask: !this.data.buyMask
      })
      return
    }
    this.data.addCar = e.currentTarget.dataset.type === 'car'
    this.setData({
      buyMask: !this.data.buyMask
    })
  },
  noUse () {
    app.noUse()
  },
  numOperation (e) {
    let type = e.currentTarget.dataset.type
    if (type === 'add') {
      if (this.data.num >= this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, {content: '已达库存上限'})
      this.setData({
        num: ++this.data.num
      })
    } else {
      if (this.data.num <= 1) return
      this.setData({
        num: --this.data.num
      })
    }
  },
  chooseSp (e) {
    this.setData({
      labelIndex: e.currentTarget.dataset.index,
      current: 0
    })
  },
  shopProduct (pid) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : []
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : []
          app.setBar(res.data.data.title)
          res.data.data['stock'] = 0
          for (let v of res.data.data.sku) {
            v['discount'] = (v.price * that.data.discount_value).toFixed(2)
            res.data.data['stock'] += v.stock * 1
          }
          let sku = res.data.data.sku
          sku.map((v, i) => {
            if (!v.img) {
              sku[i].img = []
            } else {
              let temp = v.img.split(',')
              let tempArr = []
              temp.map((vv, ii) => {
                tempArr.push(vv)
              })
              sku[i].img = tempArr
            }
          })
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onShareAppMessage () {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
        imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log('options', options)
    if (options.scene) { // 通过分享进入拼团
      let scene = decodeURIComponent(options.scene).split(',')
      options.ping = scene[0] // 拼团标识
      options.id = scene[1] // 拼团产品id
      options.from = scene[2] // 拼团发起人id
    }
    this.setData({
      options,
      ping: options.ping === 'ping'
    })
    this.shopProduct(options.id)
    console.log('route', this.route)
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
